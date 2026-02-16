document.addEventListener("DOMContentLoaded", () => {
  const dataEl = document.getElementById('chart-data-json');
  if (!dataEl || !dataEl.textContent) return;

  let chartData;
  try {
    chartData = JSON.parse(dataEl.textContent.trim());
  } catch (e) {
    console.error("❌ Gagal parse JSON chart data:", e);
    return;
  }

  const activityChart = Array.isArray(chartData.activityChart) ? chartData.activityChart : [];
  const statusChart = Array.isArray(chartData.statusChart) ? chartData.statusChart : [];
  const statusPersenChart = Array.isArray(chartData.statusPersenChart) ? chartData.statusPersenChart : [];

  const DONUT_COLORS = [
    '#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#36b9cc',
    '#858796', '#5a5c69', '#2e59d9', '#17a673', '#2c9faf',
    '#e74a3b', '#fd7e14', '#6f42c1', '#20c9a6', '#eaecf4'
  ];

  const chartConfigs = [
    { id: 'activityChart', title: '[Realisasi PK - Harian PPI] Chart Activities Category', data: activityChart },
    { id: 'statusChart', title: '[Realisasi PK - Harian PPI] Chart Status', data: statusChart },
    { id: 'statusPersenChart', title: '[Realisasi PK - Harian PPI] Chart Status %', data: statusPersenChart }
  ];

  const chartInstances = {};
  const expandModal = document.getElementById('chartExpandOverlay');
  const expandTitle = document.getElementById('chartExpandTitle');
  const expandCanvas = document.getElementById('chartExpandCanvas');
  const expandClose = document.getElementById('chartExpandClose');
  let expandChartInstance = null;

  function buildDonutChart(canvasId, title, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = (data || []).map(d => d.label);
    const values = (data || []).map(d => d.total);
    const colors = labels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]);
    const borderColors = colors.map(c => c);

    return new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        layout: { padding: { right: 20 } },
        plugins: {
          legend: { display: true, position: 'right', labels: { padding: 12, usePointStyle: true, pointStyle: 'circle' } },
          title: { display: true, text: title, font: { size: 16 }, padding: { bottom: 12 } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  function buildFilterList(chartId, data) {
    const listEl = document.querySelector(`.filter-list[data-filter-for="${chartId}"]`);
    if (!listEl || !data.length) return;

    listEl.innerHTML = data.map((d, i) => `
      <label class="filter-item">
        <input type="checkbox" value="${i}" data-label="${String(d.label).replace(/"/g, '&quot;')}" checked>
        ${d.label}
      </label>
    `).join('');
  }

  function applyFilter(chartId) {
    const meta = chartInstances[chartId];
    if (!meta || !meta.chart) return;

    const listEl = document.querySelector(`.filter-list[data-filter-for="${chartId}"]`);
    if (!listEl) return;

    const checked = Array.from(listEl.querySelectorAll('input:checked')).map(cb => meta.fullData[parseInt(cb.value, 10)]);
    const data = checked.length ? checked : meta.fullData;

    const labels = data.map(d => d.label);
    const values = data.map(d => d.total);
    const colors = labels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]);

    meta.chart.data.labels = labels;
    meta.chart.data.datasets[0].data = values;
    meta.chart.data.datasets[0].backgroundColor = colors;
    meta.chart.data.datasets[0].borderColor = colors;
    meta.chart.update('none');
    meta.currentData = data;

    document.getElementById(`filter-${chartId}`).classList.remove('is-open');
  }

  function openExpand(chartId) {
    const meta = chartInstances[chartId];
    if (!meta || !meta.chart) return;

    const data = meta.currentData || meta.fullData;
    const title = meta.title;

    if (expandChartInstance) {
      expandChartInstance.destroy();
      expandChartInstance = null;
    }

    expandTitle.textContent = title;
    const labels = data.map(d => d.label);
    const values = data.map(d => d.total);
    const colors = labels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]);

    expandChartInstance = new Chart(expandCanvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        layout: { padding: { right: 20 } },
        plugins: {
          legend: { display: true, position: 'right', labels: { padding: 12, usePointStyle: true, pointStyle: 'circle' } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    expandModal.classList.add('is-open');
    expandModal.setAttribute('aria-hidden', 'false');
  }

  function closeExpand() {
    if (expandChartInstance) {
      expandChartInstance.destroy();
      expandChartInstance = null;
    }
    expandModal.classList.remove('is-open');
    expandModal.setAttribute('aria-hidden', 'true');
  }

  chartConfigs.forEach(({ id, title, data }) => {
    const fullData = data || [];
    const chart = buildDonutChart(id, title, fullData);
    if (chart) {
      chartInstances[id] = { chart, fullData, currentData: fullData, title };
      buildFilterList(id, fullData);
    }
  });

  document.querySelectorAll('.chart-container[data-chart-id]').forEach(container => {
    const chartId = container.dataset.chartId;

    container.querySelector('.chart-btn-filter').addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById(`filter-${chartId}`);
      dropdown.classList.toggle('is-open');
      document.querySelectorAll('.chart-filter-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('is-open');
      });
    });

    container.querySelector('.chart-btn-apply').addEventListener('click', () => applyFilter(chartId));

    container.querySelector('.chart-btn-expand').addEventListener('click', () => openExpand(chartId));
  });

  expandClose.addEventListener('click', closeExpand);
  expandModal.addEventListener('click', (e) => { if (e.target === expandModal) closeExpand(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeExpand(); });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.chart-actions') && !e.target.closest('.chart-filter-dropdown')) {
      document.querySelectorAll('.chart-filter-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    }
  });
});

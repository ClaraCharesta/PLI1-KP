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

  const areaChart = Array.isArray(chartData.areaChart) ? chartData.areaChart : [];
  const prioritasChart = Array.isArray(chartData.prioritasChart) ? chartData.prioritasChart : [];
  const statusChart = Array.isArray(chartData.statusChart) ? chartData.statusChart : [];
  const abnormalChart = Array.isArray(chartData.abnormalChart) ? chartData.abnormalChart : [];
  const nomenclatureChart = Array.isArray(chartData.nomenclatureChart) ? chartData.nomenclatureChart : [];

  const DONUT_COLORS = [
    '#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#36b9cc',
    '#858796', '#5a5c69', '#2e59d9', '#17a673', '#2c9faf',
    '#fd7e14', '#6f42c1', '#20c9a6', '#eaecf4'
  ];

  const chartConfigs = [
    { id: 'areaChart', title: '[Abnormalitas] Chart Area', data: areaChart, type: 'doughnut' },
    { id: 'prioritasChart', title: '[Abnormalitas] Chart Prioritas', data: prioritasChart, type: 'doughnut' },
    { id: 'statusChart', title: '[Abnormalitas] Chart Status', data: statusChart, type: 'doughnut' },
    { id: 'abnormalChart', title: '[Abnormalitas] Abnormal', data: abnormalChart, type: 'doughnut' },
    { id: 'nomenclatureChart', title: '[Abnormalitas] Chart Nomenclature', data: nomenclatureChart, type: 'bar' }
  ];

  const chartInstances = {};
  const expandModal = document.getElementById('chartExpandOverlay');
  const expandTitle = document.getElementById('chartExpandTitle');
  const expandCanvas = document.getElementById('chartExpandCanvas');
  const expandClose = document.getElementById('chartExpandClose');
  let expandChartInstance = null;

  function truncateLabel(label, maxLen) {
    if (!label) return '';
    return label.length > (maxLen || 35) ? label.substring(0, 32) + '...' : label;
  }

  function buildDonutChart(canvasId, title, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = (data || []).map(d => d.label);
    const values = (data || []).map(d => d.total);
    const colors = labels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]);

    return new Chart(ctx, {
      type: "doughnut",
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
          title: { display: true, text: title, font: { size: 14 }, padding: { bottom: 10 } },
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

  function buildBarChart(canvasId, title, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const rawData = data || [];
    const labels = rawData.map(d => truncateLabel(d.label));
    const values = rawData.map(d => d.total);

    return new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: 'Count',
          data: values,
          backgroundColor: '#f6c23e',
          borderColor: '#e74a3b',
          borderWidth: 1,
          barThickness: 16,
          maxBarThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 10 } },
        plugins: {
          legend: { display: false },
          title: { display: true, text: title, font: { size: 14 }, padding: { bottom: 10 } }
        },
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1 } },
          y: { ticks: { font: { size: 10 }, maxRotation: 0 } }
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
        ${truncateLabel(d.label, 50)}
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
    meta.currentData = data;

    if (meta.chart.config.type === 'doughnut') {
      const labels = data.map(d => d.label);
      const values = data.map(d => d.total);
      const colors = labels.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]);
      meta.chart.data.labels = labels;
      meta.chart.data.datasets[0].data = values;
      meta.chart.data.datasets[0].backgroundColor = colors;
      meta.chart.data.datasets[0].borderColor = colors;
    } else {
      const labels = data.map(d => truncateLabel(d.label));
      const values = data.map(d => d.total);
      meta.chart.data.labels = labels;
      meta.chart.data.datasets[0].data = values;
    }

    meta.chart.update('none');
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

    if (meta.chart.config.type === 'doughnut') {
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
    } else {
      const labels = data.map(d => truncateLabel(d.label));
      const values = data.map(d => d.total);
      expandChartInstance = new Chart(expandCanvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Count',
            data: values,
            backgroundColor: '#f6c23e',
            borderColor: '#e74a3b',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: 10 } },
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, ticks: { stepSize: 1 } },
            y: { ticks: { font: { size: 11 }, maxRotation: 0 } }
          }
        }
      });
    }

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

  chartConfigs.forEach(({ id, title, data, type }) => {
    const fullData = data || [];
    const chart = type === 'bar' ? buildBarChart(id, title, fullData) : buildDonutChart(id, title, fullData);
    if (chart) {
      chartInstances[id] = { chart, fullData, currentData: fullData, title };
      buildFilterList(id, fullData);
    }
  });

document.querySelectorAll('.chart-container[data-chart-id]').forEach(container => {
  const chartId = container.dataset.chartId;

  const btnFilter = container.querySelector('.chart-btn-filter');
  const btnExpand = container.querySelector('.chart-btn-expand');

  // FILTER
  if (btnFilter) {
    btnFilter.addEventListener('click', (e) => {
      e.stopPropagation();

      const dropdown = document.getElementById(`filter-${chartId}`);

      // tutup dropdown lain
      document.querySelectorAll('.chart-filter-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('is-open');
      });

      dropdown.classList.toggle('is-open');
    });
  }

  // 🔥 EXPAND (INI YANG HILANG)
  if (btnExpand) {
    btnExpand.addEventListener('click', (e) => {
      e.stopPropagation();
      openExpand(chartId);
    });
  }
});



  document.querySelectorAll('.chart-filter-dropdown .chart-btn-apply').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dropdown = e.target.closest('.chart-filter-dropdown');
      if (dropdown) {
        const chartId = dropdown.id.replace('filter-', '');
        applyFilter(chartId);
      }
    });
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

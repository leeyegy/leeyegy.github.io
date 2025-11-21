(function () {
  var REFRESH_INTERVAL_MS = 60 * 1000;

  var chartInstance = null;
  var refreshTimer = null;

  function $(selector) {
    return document.querySelector(selector);
  }

  var chartCanvas = $('#binance-balance-chart');
  if (!chartCanvas) {
    return;
  }

  var statusEl = $('#binance-data-status');
  var lastUpdatedEl = $('#binance-last-updated');
  var historyUrl =
    chartCanvas.getAttribute('data-source') ||
    '/assets/data/binance/balance-history.json';
  var positionsTable = document.querySelector('.binance-positions__table');
  var positionsBody = document.querySelector('#binance-positions-body');
  var positionsUrl =
    (positionsTable && positionsTable.getAttribute('data-source')) ||
    '/assets/data/binance/positions.json';

  function formatTimeLabel(timestamp) {
    var date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '--';
    }
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function setStatus(state, message) {
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.classList.remove(
      'binance-monitor__chip--pending',
      'binance-monitor__chip--ok',
      'binance-monitor__chip--error'
    );

    var className = 'binance-monitor__chip--' + state;
    statusEl.classList.add(className);
  }

  function formatUsd(value) {
    return '$' + Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatSize(value) {
    return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 6 });
  }

  function formatDateTime(timestamp) {
    if (!timestamp) return '--';
    var date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function renderPositions(positions) {
    if (!positionsBody) return;
    positionsBody.innerHTML = '';
    if (!Array.isArray(positions) || positions.length === 0) {
      var emptyRow = document.createElement('tr');
      var emptyCell = document.createElement('td');
      emptyCell.colSpan = 6;
      emptyCell.textContent = 'No open positions.';
      emptyRow.appendChild(emptyCell);
      positionsBody.appendChild(emptyRow);
      return;
    }

    positions.forEach(function (position) {
      var row = document.createElement('tr');
      row.classList.add('binance-positions__row');

      var symbolCell = document.createElement('td');
      symbolCell.textContent = position.symbol || '--';
      symbolCell.classList.add('binance-positions__symbol');

      var sideCell = document.createElement('td');
      var sideRaw = (position.side || '').toUpperCase();
      var normalizedSide = sideRaw === 'SHORT' ? 'short' : 'long';
      var sideBadge = document.createElement('span');
      sideBadge.className = 'binance-positions__side binance-positions__side--' + normalizedSide;
      sideBadge.textContent = normalizedSide === 'short' ? 'Short' : 'Long';
      sideCell.appendChild(sideBadge);

      row.classList.add('binance-positions__row--' + normalizedSide);

      var sizeCell = document.createElement('td');
      sizeCell.textContent = formatSize(position.size);

      var entryCell = document.createElement('td');
      entryCell.textContent = formatUsd(position.entryPrice);

      var pnlCell = document.createElement('td');
      var pnlValue = Number(position.unrealizedPnl || 0);
      pnlCell.textContent = formatUsd(pnlValue);
      pnlCell.classList.add(
        'binance-positions__pnl',
        pnlValue >= 0 ? 'binance-positions__pnl--positive' : 'binance-positions__pnl--negative'
      );

      var openedCell = document.createElement('td');
      openedCell.textContent = formatDateTime(position.openedAt);

      var updatedCell = document.createElement('td');
      updatedCell.textContent = formatDateTime(position.reportedAt || position.updatedAt);

      [
        symbolCell,
        sideCell,
        sizeCell,
        entryCell,
        pnlCell,
        openedCell,
        updatedCell
      ].forEach(function (cell) {
        row.appendChild(cell);
      });

      positionsBody.appendChild(row);
    });
  }

  function buildDataset(history) {
    if (!Array.isArray(history)) return { labels: [], data: [] };

    var sorted = history
      .filter(function (item) {
        return item && item.timestamp && typeof item.totalUsd === 'number';
      })
      .sort(function (a, b) {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

    return {
      labels: sorted.map(function (item) {
        return formatTimeLabel(item.timestamp);
      }),
      rawTimestamps: sorted.map(function (item) {
        return item.timestamp;
      }),
      data: sorted.map(function (item) {
        return Number(item.totalUsd.toFixed(2));
      })
    };
  }

  function initChart(dataset) {
    chartInstance = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: dataset.labels,
        datasets: [
          {
            label: 'Total Assets (USD)',
            data: dataset.data,
            fill: false,
            tension: 0.3,
            borderColor: '#00e0ff',
            backgroundColor: 'rgba(0, 224, 255, 0.3)',
            pointRadius: 2.5,
            pointHoverRadius: 5,
            pointBackgroundColor: '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            },
            ticks: {
              maxRotation: 0
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'USD'
            },
            ticks: {
              callback: function (value) {
                return '$' + value.toLocaleString('en-US');
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';
                var value = context.parsed.y || 0;
                return label + ': $' + value.toLocaleString('en-US', { minimumFractionDigits: 2 });
              },
              afterLabel: function (context) {
                var dataset = context.chart.data;
                var index = context.dataIndex;
                var timestamps = dataset.rawTimestamps || [];
                if (timestamps[index]) {
                  return 'UTC: ' + timestamps[index];
                }
                return '';
              }
            }
          }
        }
      }
    });
    chartInstance.config.data.rawTimestamps = dataset.rawTimestamps;
  }

  function updateChart(dataset) {
    if (!chartInstance) {
      initChart(dataset);
      return;
    }
    chartInstance.data.labels = dataset.labels;
    chartInstance.data.datasets[0].data = dataset.data;
    chartInstance.data.rawTimestamps = dataset.rawTimestamps;
    chartInstance.update('active');
  }

  function updateLastUpdated(timestamp) {
    if (!lastUpdatedEl) return;
    if (!timestamp) {
      lastUpdatedEl.textContent = '--';
      return;
    }
    var date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      lastUpdatedEl.textContent = timestamp;
    } else {
      lastUpdatedEl.textContent = date.toLocaleString('en-US', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }

  async function fetchJson(url) {
    var response = await fetch(url + (url.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now(), {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Network error: ' + response.status + ' ' + url);
    }
    return response.json();
  }

  async function fetchDashboardData() {
    try {
      setStatus('pending', 'Loading...');
      var results = await Promise.all([fetchJson(historyUrl), fetchJson(positionsUrl)]);
      var historyPayload = results[0];
      var positionsPayload = results[1];

      var dataset = buildDataset(historyPayload.history);
      if (!dataset.data.length) {
        throw new Error('No data available');
      }
      updateChart(dataset);
      updateLastUpdated(historyPayload.generatedAt || dataset.rawTimestamps.slice(-1)[0]);
      var positions = Array.isArray(positionsPayload)
        ? positionsPayload
        : positionsPayload.positions;
      renderPositions(positions || []);
      setStatus('ok', 'Up to date');
    } catch (error) {
      console.error('[Binance Monitor] Failed to update data', error);
      setStatus('error', 'Error');
    }
  }

  function startPolling() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    refreshTimer = setInterval(fetchDashboardData, REFRESH_INTERVAL_MS);
  }

  fetchDashboardData();
  startPolling();
})();


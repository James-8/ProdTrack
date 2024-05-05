"use client"

import { useEffect } from 'react';
import Chart from 'chart.js/auto';

interface PriceHistoryEntry {
  price: number;
  date: Date;
}

interface Props {
  title: string;
  priceHistory: PriceHistoryEntry[];
}

const PriceHistoryCard = ({ title, priceHistory }: Props) => {
  useEffect(() => {
    renderPriceChart();
  }, [priceHistory]);

  const renderPriceChart = () => {
    const ctx = document.getElementById('priceChart') as HTMLCanvasElement;

    if (priceHistory.length > 0) {
      const prices = priceHistory.map(entry => entry.price);
      const dates = priceHistory.map(entry => new Date(entry.date).toLocaleDateString());

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Price History',
            data: prices,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price'
              }
            }
          }
        }
      });
    }
  };

  return (
    <div className={`price-history_card`}>
      <p className="text-base text-black-100">{title}</p>
      <canvas id="priceChart"></canvas>
    </div>
  );
};

export default PriceHistoryCard;

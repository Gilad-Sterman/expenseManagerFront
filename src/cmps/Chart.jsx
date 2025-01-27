import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
export function Chart({ type, data, className }) {
    return (
        <section className={`chart ${className ? className : ''}`} >
            {type === 'Doughnut' && <Doughnut data={data} />}
            {type === 'Bar' && <Bar data={data} />}
            {type === 'Line' && <Line data={data} />}
        </section>
    )
}
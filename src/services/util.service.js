export const utilService = {
    getGreeting,
    generateRandomId,
    getDataFromUser,
    getDataByMonthFromUser,
    getTotalsForMonth
}

const months = [
    { name: 'ינואר', num: 1 },
    { name: 'פברואר', num: 2 },
    { name: 'מרץ', num: 3 },
    { name: 'אפריל', num: 4 },
    { name: 'מאי', num: 5 },
    { name: 'יוני', num: 6 },
    { name: 'יולי', num: 7 },
    { name: 'אוגוסט', num: 8 },
    { name: 'ספטמבר', num: 9 },
    { name: 'אוקטובר', num: 10 },
    { name: 'נובמבר', num: 11 },
    { name: 'דצמבר', num: 12 },
]

function getGreeting() {
    const time = new Date().getHours()
    const greetingsHeb = ["בוקר טוב", "צהריים טובים", "ערב טוב", "לילה טוב"]
    if (time >= 6 && time < 12) return greetingsHeb[0]
    if (time >= 12 && time < 15) return greetingsHeb[1]
    if (time >= 15 && time < 20) return greetingsHeb[2]
    return greetingsHeb[3]
}

function generateRandomId(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

function getDataFromUser(user, selectedMonth) {

    const currentYear = new Date().getFullYear()

    const monthlyExpenses = user.expenses.filter(expense => {
        const [year, month] = expense.date.split('-').map(Number)
        return year === currentYear && month === selectedMonth
    })

    const typeTotals = monthlyExpenses.reduce((acc, expense) => {
        acc[expense.type] = (acc[expense.type] || 0) + expense.paid
        return acc
    }, {})

    const labels = Object.keys(typeTotals)
    const data = Object.values(typeTotals)

    return {
        datasets: [{
            data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#dc5b38', '#74967e', '#6b6e76', '#5a84c4',],
        }],
        labels
    };
}

function getDataByMonthFromUser(user, type) {

    const monthlyTotals = user.expenses.filter(e => type === 'Total' ? e : e.type === type).reduce((acc, expense) => {
        const [year, month] = expense.date.split('-') // Extract year and month
        const monthObj = months.find(m => m.num === parseInt(month, 10)) // Ensure month is an integer
        if (monthObj) {
            const key = monthObj.name;
            acc[key] = (acc[key] || 0) + expense.paid // Accumulate the total for the month
        }
        return acc
    }, {})

    const labels = Object.keys(monthlyTotals) // Get month names with data
    const data = Object.values(monthlyTotals) // Get totals for each month

    return {
        labels, // Labels for the x-axis
        datasets: [
            {
                label: `${type === 'Total' ? `הוצאות חודשיות סה"כ` : type}`, // Name of the dataset
                data, // Data for each label
                backgroundColor: '#36A2EB', // Bar color
            },
        ],
    }
}

function getTotalsForMonth(expenses, selectedMonth) {
    const monthlyExpenses = expenses.filter(expense => {
        const [year, month] = expense.date.split('-').map(Number)
        return month === selectedMonth
    })

    if (monthlyExpenses.length === 1) return monthlyExpenses[0].paid
    if (monthlyExpenses.length === 0) return 0

    return monthlyExpenses.reduce((acc, expense) => {
        acc = (acc || 0) + expense.paid
        return Number(acc)
    }, {})
}




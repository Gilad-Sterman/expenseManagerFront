export const utilService = {
    getGreeting,
    generateRandomId,
    getDataFromUser,
    getBar1Data,
    getBar2Data,
    getBar3Data,
    getBar4Data,
    getTotalsForMonth,
    getExpensesUpToDay
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

const chartColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#8BC34A", "#D32F2F", "#0288D1", "#FBC02D",
    "#7B1FA2", "#C2185B", "#00796B", "#5D4037", "#455A64"
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

    // Sort entries by total amount (highest first)
    const sortedEntries = Object.entries(typeTotals).sort((a, b) => b[1] - a[1])
    const labels = sortedEntries.map(entry => entry[0])
    const data = sortedEntries.map(entry => entry[1])

    return {
        datasets: [{
            data,
            backgroundColor: chartColors,
        }],
        labels
    };
}

function getBar1Data(user, type) {
    const monthlyData = user.expenses
        .filter(e => type === 'Total' ? e : e.type === type)
        .reduce((acc, expense) => {
            const [year, month] = expense.date.split('-')
            const monthObj = months.find(m => m.num === parseInt(month, 10))
            if (monthObj) {
                const key = monthObj.name
                if (!acc[key]) {
                    acc[key] = { total: 0, count: 0 };
                }
                acc[key].total += expense.paid
                acc[key].count += 1
            }
            return acc
        }, {})

    const labels = Object.keys(monthlyData).sort((a, b) => {
        const monthA = months.find(m => m.name === a)
        const monthB = months.find(m => m.name === b)
        return monthA.num - monthB.num
    })

    const totals = labels.map(label => monthlyData[label].total)
    const counts = labels.map(label => monthlyData[label].count)
    const avg = totals.reduce((acc, expense) => {
        return acc + expense
    }, 0) / totals.length
    const avgs = totals.map(t => Math.round(avg * 10) / 10)

    return {
        labels,
        datasets: [
            {
                label: 'ממוצע',
                data: avgs,
                backgroundColor: 'gray',
                borderDash: [5, 5]
            },
            {
                label: 'סכום ששולם',
                data: totals,
                backgroundColor: '#36A2EE',
                borderColor: '#36A2EE',
            },
        ],
    }
}

function getBar2Data(user, selectedMonth) {
    const currentYear = new Date().getFullYear()

    const typeMap = {}

    user.expenses
        .filter(expense => {
            const [year, month] = expense.date.split('-').map(Number)
            return year === currentYear && month === selectedMonth
        })
        .forEach(expense => {
            const paymentType = expense.pType === 'card' ? 'אשראי' : expense.pType === 'transfer' ? 'העברה בנקאית' : expense.pType === 'cash' ? 'מזומן' : 'אחר'
            if (typeMap[paymentType]) {
                typeMap[paymentType] += expense.paid
            } else {
                typeMap[paymentType] = expense.paid
            }
        })

    const labels = Object.keys(typeMap)
    const data = Object.values(typeMap)

    return {
        labels,
        datasets: [
            {
                label: 'סכום הוצאות לפי צורת תשלום', // Name of the dataset
                data, // Data for each label
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#4BC0C0'], // Example colors
            },
        ],
    }
}

function getBar3Data(user, type) {
    const monthlyData = user.expenses
        .filter(e => type === 'Total' ? e : e.type === type)
        .reduce((acc, expense) => {
            const [year, month] = expense.date.split('-')
            const monthObj = months.find(m => m.num === parseInt(month, 10))
            if (monthObj) {
                const key = monthObj.name
                if (!acc[key]) {
                    acc[key] = { total: 0, count: 0 };
                }
                acc[key].total += expense.paid
                acc[key].count += 1
            }
            return acc
        }, {})

    const labels = Object.keys(monthlyData).sort((a, b) => {
        const monthA = months.find(m => m.name === a)
        const monthB = months.find(m => m.name === b)
        return monthA.num - monthB.num
    })
    const counts = labels.map(label => monthlyData[label].count)
    const avg = counts.reduce((acc, expense) => {
        return acc + expense
    }, 0) / counts.length
    const avgs = counts.map(t => Math.round(avg * 10) / 10)

    return {
        labels,
        datasets: [
            {
                label: `ממוצע`,
                data: avgs,
                backgroundColor: 'gray',
                borderDash: [5, 5]
            },
            {
                label: `מס' הוצאות`,
                data: counts,
                backgroundColor: '#FF9F40',
                borderColor: '#FF9F40',
            },
        ],
    }
}

function getBar4Data(user, selectedMonth) {
    const currentYear = new Date().getFullYear()

    const typeMap = {}

    user.expenses
        .filter(expense => {
            const [year, month] = expense.date.split('-').map(Number)
            return year === currentYear && month === selectedMonth
        })
        .forEach(expense => {
            const paymentType =
                expense.pType === 'card'
                    ? 'אשראי'
                    : expense.pType === 'transfer'
                        ? 'העברה בנקאית'
                        : expense.pType === 'cash'
                            ? 'מזומן'
                            : 'אחר'

            if (!typeMap[paymentType]) {
                typeMap[paymentType] = { total: 0, count: 0 }
            }

            typeMap[paymentType].total += expense.paid
            typeMap[paymentType].count += 1
        })

    const labels = Object.keys(typeMap)
    const counts = labels.map(label => typeMap[label].count)

    return {
        labels,
        datasets: [
            {
                label: 'כמות הוצאות לפי צורת תשלום',
                data: counts,
                backgroundColor: '#FF9F40',
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
        return acc + expense.paid
    }, 0)
}

/**
 * Get expenses for a specific month up to a specific day
 * @param {Array} expenses - Array of expense objects
 * @param {Number} month - Month number (1-12)
 * @param {Number} year - Year
 * @param {Number} day - Day of month to filter up to
 * @returns {Number} - Total expenses for the month up to the specified day
 */
function getExpensesUpToDay(expenses, month, year, day) {
    return expenses.reduce((acc, expense) => {
        const expenseDate = new Date(expense.date)
        const expenseMonth = expenseDate.getMonth() + 1 // JavaScript months are 0-indexed
        const expenseYear = expenseDate.getFullYear()
        const expenseDay = expenseDate.getDate()
        
        if (expenseMonth === month && expenseYear === year && expenseDay <= day) {
            return acc + expense.paid
        }
        return acc
    }, 0)
}

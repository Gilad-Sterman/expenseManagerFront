import { updateUser } from "../store/user.actions"
import { httpService } from "./http.service"
import { userService } from "./user.service"

export const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']

export const expenseService = {
    getExpenses,
    getExpensesByMonth,
    getExpenseTypes,
    updateExpenses
}

function getExpenses(filterBy, expenses) {
    const { maxNum, sortBy, txt, sortDir, selectedTypes } = filterBy
    const myExpenses = expenses.filter(expense => {
        if (maxNum && txt) return expense.paid <= maxNum && expense.desc.toLowerCase().includes(txt.toLowerCase())
        if (maxNum) return expense.paid <= maxNum
        if (txt) return expense.desc.toLowerCase().includes(txt.toLowerCase())
        return expense
    }).filter(expense => {
        if (selectedTypes.length) {
            return selectedTypes.includes(expense.type)
        } return true
    }).sort((expense1, expense2) => {
        if (sortDir === 'up') return expense2[sortBy] - expense1[sortBy]
        return expense1[sortBy] - expense2[sortBy]
    })
    return myExpenses
}

function getExpensesByMonth(expenses) {
    const eByMonth = expenses.filter(e => e.date)
}

function getExpenseTypes(expenses) {
    const types = []
    expenses.forEach(expense => {
        if (types.includes(expense.type)) {
            return
        } types.push(expense.type)
    })
    return types
}

async function updateExpenses(newExpenses, userId) {
    try {
        // const res = await httpService.put(`user/updateExpensess`, { newExpenses, userId })
        const user = userService.getLoggedinUser()
        user.expenses = newExpenses
        userService.saveLocalUser(user)
        updateUser(user)
        return user
    } catch (err) {
        console.log(err)
    }
}
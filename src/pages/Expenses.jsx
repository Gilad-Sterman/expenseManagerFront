import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { expenseService } from "../services/expense.service"
import { Filter } from "../cmps/Filter"
import { utilService } from "../services/util.service"
import { AddNewModal } from "../cmps/AddNewModal"


export function Expenses() {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    const [expenses, setExpenses] = useState([])
    const [allExpenses, setAllExpenses] = useState([])
    const [isEdit, setIsEdit] = useState({ ids: [] })

    const [allTotals, setAllTotals] = useState({ tPaid: 0, amount: 0 })

    const sortOptions = [{ value: 'date', title: 'תאריך' }, { value: 'desc', title: 'תיאור' }, { value: 'type', title: 'סוג', disabled: true }, { value: 'paid', title: 'שולם' }]
    const [expenseTypes, setExpenseTypes] = useState([])
    const [expenseFilter, setExpenseFilter] = useState({ maxNum: '', sortBy: 'date', txt: '', sortDir: 'down', selectedTypes: [] })

    const [showAddExpense, setShowAddExpense] = useState(true)
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const TODAY = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    const ExpenseToAdd = { id: '', date: TODAY, desc: '', paid: '', type: '' }

    useEffect(() => {
        if (!loggedUser) {
            navigate('/login')
            return
        }
        setAllExpenses(loggedUser.expenses)
        const types = expenseService.getExpenseTypes(loggedUser.expenses)
        setExpenseTypes(types)
    }, [loggedUser])

    useEffect(() => {
        loadExpenses()
    }, [expenseFilter])

    useEffect(() => {
        setTotals()
    }, [expenses])

    function loadExpenses() {
        const expensesRes = expenseService.getExpenses(expenseFilter, loggedUser.expenses)
        setExpenses(expensesRes)
    }

    function setTotals() {
        const tPaid = expenses?.reduce((acc, product) => {
            return product.paid + acc
        }, 0)

        const totals = JSON.parse(JSON.stringify(allTotals))
        const amount = expenses?.length
        totals.tPaid = tPaid
        totals.amount = amount
        setAllTotals(totals)
    }

    function onShowProduct(ev) {
        ev.stopPropagation()
        setShowAddExpense(!showAddExpense)
    }

    async function handleAddExpense(newExpense) {
        newExpense.id = utilService.generateRandomId()
        const newFilteredExpenses = [...expenses, newExpense]
        const newExpenses = [...allExpenses, newExpense]
        setExpenses(newFilteredExpenses)
        setAllExpenses(newExpenses)
        try {
            updateExpenses(newExpenses)
        } catch (err) {
            console.log(err)
        }
    }

    async function handleDeleteExpense(expenseId) {
        const newFilteredExpenses = expenses.filter(expense => expense.id !== expenseId)
        const newExpenses = allExpenses.filter(expense => expense.id !== expenseId)
        setExpenses(newFilteredExpenses)
        setAllExpenses(newExpenses)
        try {
            updateExpenses(newExpenses)
        } catch (err) {
            console.log(err)
        }
    }

    async function updateExpenses(newExpenses) {
        try {
            const res = await expenseService.updateExpenses(newExpenses, loggedUser._id)
            setShowAddExpense(false)
        } catch (err) {
            console.log(err)
        }
    }

    function setSortDir(dir) {
        expenseFilter.sortDir = dir
        const newFilter = JSON.parse(JSON.stringify(expenseFilter))
        setExpenseFilter(newFilter)
    }

    function setSort({ value, disabled }) {
        if (disabled) return
        expenseFilter.sortBy = value
        const newFilter = JSON.parse(JSON.stringify(expenseFilter))
        setExpenseFilter(newFilter)
    }

    function handleExpenseInput({ target }) {
        const updatedExpenses = allExpenses.map(expense => {
            if (expense.id === target.id) expense[target.name] = target.type === 'number' ? +target.value : target.value
            return expense
        })
        const updatedFilteredExpenses = expenses.map(expense => {
            if (expense.id === target.id) expense[target.name] = target.type === 'number' ? +target.value : target.value
            return expense
        })
        setExpenses(updatedFilteredExpenses)
        setAllExpenses(updatedExpenses)
    }


    return (
        <section className="expenses-page" onClick={() => setShowAddExpense(false)}>
            <h2>פירוט הוצאות</h2>
            {<button onClick={(ev) => onShowProduct(ev)}>הוצאה חדשה</button>}
            {<Filter filterBy={expenseFilter} setFilterBy={setExpenseFilter} type={'inventory'} expenseTypes={expenseTypes} />}
            {allExpenses && !!allExpenses.length && <ul className="expenses-list">
                <li className="title">
                    {sortOptions.map((option, idx) => <span onClick={() => setSort({ value: option.value, disabled: option.disabled })} key={idx} className={`${expenseFilter.sortBy === option.value ? 'selected' : ''} ${option.disabled ? '' : 'active'}`}>{option.title}</span>)}
                    <button className="sortDir-btn" onClick={() => setSortDir(expenseFilter.sortDir === 'up' ? 'down' : 'up')}>
                        <img className={`sortDir ${expenseFilter.sortDir === 'up' ? 'up' : 'down'}`} src="https://res.cloudinary.com/dollaguij/image/upload/v1701785794/wednesday/bwudwrzkha2pdcy3ga7q.svg" alt="" />
                    </button>
                    {/* <div title="עדכן הכל" className="update-all-box" onClick={() => handleEditAll()}>
                        {!!isEdit.ids.length && <img className="update-all" src="https://res.cloudinary.com/dollaguij/image/upload/v1699194254/svg/checked_paj0fg.svg" alt="" />}
                    </div> */}
                </li>
                {expenses?.map(expense => (
                    <li key={expense.id}>
                        <input disabled={isEdit.ids.includes(expense.id) ? false : true} id={expense.id} className="date" name="date" type="date" value={expense.date} onInput={handleExpenseInput} />
                        <input disabled={isEdit.ids.includes(expense.id) ? false : true} id={expense.id} name="desc" type="text" value={expense.desc} onInput={handleExpenseInput} />
                        <input disabled={isEdit.ids.includes(expense.id) ? false : true} id={expense.id} name="type" type="type" value={expense.type} onInput={handleExpenseInput} />
                        <input disabled={isEdit.ids.includes(expense.id) ? false : true} id={expense.id} className="red" name="paid" type="number" value={expense.paid} onInput={handleExpenseInput} />
                        <button className="btn-delete" onClick={() => handleDeleteExpense(expense.id)}>
                            <img src="https://res.cloudinary.com/dollaguij/image/upload/v1699194245/svg/x_ti24ab.svg" alt="" />
                        </button>
                        {/* {!isEdit.ids.includes(expense.id) && <button className="btn-edit" onClick={() => handleIsEdit(product.id, true)}>
                            <img src="https://res.cloudinary.com/dollaguij/image/upload/v1701785801/wednesday/yx9i532ccaclgxufwitg.svg" alt="" />
                        </button>}
                        {isEdit.ids.includes(expense.id) && <button className="btn-confirm" onClick={() => handleIsEdit(product.id, false)}>
                            <img src="https://res.cloudinary.com/dollaguij/image/upload/v1699194254/svg/checked_paj0fg.svg" alt="" />
                        </button>} */}
                    </li>
                ))}
                {!!expenses?.length && <li className="footer">
                    <span>סה"כ</span>
                    <span className="amount">{allTotals.amount}</span>
                    <span className="t-paid red">{allTotals.tPaid}</span>
                </li>}
            </ul>}
            {showAddExpense && <AddNewModal type={'product'} addFunc={handleAddExpense} objectToAdd={ExpenseToAdd} setShowAdd={setShowAddExpense} />}
        </section>
    )
}
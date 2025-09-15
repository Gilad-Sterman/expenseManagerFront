import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { expenseService } from "../services/expense.service"
import { Filter } from "../cmps/Filter"
import { utilService } from "../services/util.service"
import { AddNewModal } from "../cmps/AddNewModal"
import { Plus, Calendar, DollarSign, Tag, Trash2, TrendingUp, Filter as FilterIcon, Search, ArrowUpDown } from "lucide-react"

export function Expenses() {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    const [expenses, setExpenses] = useState([])
    const [allExpenses, setAllExpenses] = useState([])
    const [isEdit, setIsEdit] = useState({ ids: [] })

    const [allTotals, setAllTotals] = useState({ tPaid: 0, amount: 0 })

    const sortOptions = [{ value: 'date', title: 'תאריך' }, { value: 'desc', title: 'תיאור' }, { value: 'type', title: 'סוג', disabled: true }, { value: 'paid', title: 'שולם' }]
    const [expenseTypes, setExpenseTypes] = useState([])
    const [expenseFilter, setExpenseFilter] = useState({ maxNum: '', sortBy: 'date', txt: '', sortDir: 'down', selectedTypes: [], selectedPaymentTypes: [] })

    const [showAddExpense, setShowAddExpense] = useState(false)
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const TODAY = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    const ExpenseToAdd = { id: '', date: TODAY, desc: '', paid: '', type: '', pType: 'cash' }

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
        const newFilteredExpenses = [newExpense, ...expenses]
        const newExpenses = [newExpense, ...allExpenses]
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
            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1 className="page-title">ניהול הוצאות</h1>
                        <p className="page-subtitle">עקוב ונהל את ההוצאות שלך</p>
                    </div>
                    <button 
                        className="btn-primary add-expense-btn" 
                        onClick={(ev) => onShowProduct(ev)}
                    >
                        <Plus size={20} />
                        הוסף הוצאה חדשה
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {allExpenses && !!allExpenses.length && (
                <div className="summary-section">
                    <div className="summary-cards">
                        <div className="summary-card total">
                            <div className="card-icon">
                                <DollarSign size={24} />
                            </div>
                            <div className="card-content">
                                <h3>סך הוצאות</h3>
                                <div className="amount">
                                    <span className="value">{Math.round(allTotals.tPaid * 100) / 100}</span>
                                    <span className="currency">₪</span>
                                </div>
                            </div>
                        </div>
                        <div className="summary-card count">
                            <div className="card-icon">
                                <TrendingUp size={24} />
                            </div>
                            <div className="card-content">
                                <h3>מספר הוצאות</h3>
                                <div className="amount">
                                    <span className="value">{allTotals.amount}</span>
                                    <span className="currency">פריטים</span>
                                </div>
                            </div>
                        </div>
                        <div className="summary-card average">
                            <div className="card-icon">
                                <Calendar size={24} />
                            </div>
                            <div className="card-content">
                                <h3>ממוצע לפריט</h3>
                                <div className="amount">
                                    <span className="value">
                                        {allTotals.amount > 0 ? Math.round((allTotals.tPaid / allTotals.amount) * 100) / 100 : 0}
                                    </span>
                                    <span className="currency">₪</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls Section */}
            <div className="controls-section">
                <div className="controls-card">
                    <div className="filter-section">
                        <FilterIcon size={20} />
                        <span className="section-label">סינון וחיפוש</span>
                    </div>
                    <Filter 
                        filterBy={expenseFilter} 
                        setFilterBy={setExpenseFilter} 
                        type={'inventory'} 
                        expenseTypes={expenseTypes} 
                    />
                </div>
            </div>

            {/* Sort Controls */}
            {allExpenses && !!allExpenses.length && (
                <div className="sort-section">
                    <div className="sort-card">
                        <div className="sort-label">
                            <ArrowUpDown size={16} />
                            מיין לפי:
                        </div>
                        <div className="sort-options">
                            {sortOptions.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSort({ value: option.value, disabled: option.disabled })}
                                    className={`sort-btn ${
                                        expenseFilter.sortBy === option.value ? 'active' : ''
                                    } ${option.disabled ? 'disabled' : ''}`}
                                    disabled={option.disabled}
                                >
                                    {option.title}
                                </button>
                            ))}
                        </div>
                        <button 
                            className="sort-direction-btn" 
                            onClick={() => setSortDir(expenseFilter.sortDir === 'up' ? 'down' : 'up')}
                            title={`מיין ${expenseFilter.sortDir === 'up' ? 'יורד' : 'עולה'}`}
                        >
                            <ArrowUpDown 
                                size={16} 
                                className={`sort-icon ${expenseFilter.sortDir}`}
                            />
                        </button>
                    </div>
                </div>
            )}

            {/* Expenses List */}
            {allExpenses && !!allExpenses.length ? (
                <div className="expenses-section">
                    <div className="expenses-grid">
                        {expenses?.map(expense => (
                            <div key={expense.id} className="expense-card">
                                <div className="card-header">
                                    <div className="expense-date">
                                        <Calendar size={16} />
                                        <span>{`${expense.date.split('-')[2]}/${expense.date.split('-')[1]}/${expense.date.split('-')[0]}`}</span>
                                    </div>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        title="מחק הוצאה"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                
                                <div className="card-body">
                                    <div className="expense-description">
                                        <h3>{expense.desc}</h3>
                                    </div>
                                    
                                    <div className="expense-details">
                                        <div className="expense-type">
                                            <Tag size={14} />
                                            <span>{expense.type}</span>
                                        </div>
                                        <div className="expense-amount">
                                            <span className="amount-value">{expense.paid} ₪</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Summary Footer */}
                    {!!expenses?.length && (
                        <div className="expenses-summary">
                            <div className="summary-content">
                                <div className="summary-item">
                                    <span className="label">סך פריטים:</span>
                                    <span className="value">{allTotals.amount}</span>
                                </div>
                                <div className="summary-item total-amount">
                                    <span className="label">סך כולל:</span>
                                    <span className="value">{Math.round(allTotals.tPaid * 100) / 100} ₪</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-content">
                        <div className="empty-icon">
                            <DollarSign size={48} />
                        </div>
                        <h3>אין הוצאות עדיין</h3>
                        <p>התחל לעקוב אחר ההוצאות שלך על ידי הוספת ההוצאה הראשונה</p>
                        <button 
                            className="btn-primary" 
                            onClick={(ev) => onShowProduct(ev)}
                        >
                            <Plus size={20} />
                            הוסף את ההוצאה הראשונה
                        </button>
                    </div>
                </div>
            )}

            {/* Add Expense Modal */}
            {showAddExpense && (
                <AddNewModal 
                    type={'expense'} 
                    addFunc={handleAddExpense} 
                    objectToAdd={ExpenseToAdd} 
                    setShowAdd={setShowAddExpense} 
                    expenseTypes={expenseTypes} 
                />
            )}
        </section>
    )
}
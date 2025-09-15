import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MsgModal } from "./MsgModal"
import { X, Plus, Calendar, DollarSign, Tag, CreditCard, AlertCircle } from "lucide-react"

export function AddNewModal({ type, addFunc, objectToAdd, setShowAdd, expenseTypes }) {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    const [newObject, setNewObject] = useState(objectToAdd)
    const [isNewType, setIsNewType] = useState(true)
    const [showMsgModal, setShowMsgModal] = useState(false)
    const [myExpenses, setMyExpenses] = useState(loggedUser.expenses)

    function handleInput({ target }) {
        newObject[target.name] = target.type === 'number' ? +target.value : target.value
        const objectToAdd = JSON.parse(JSON.stringify(newObject))
        setNewObject(objectToAdd)
    }

    function handleBoolInput({ target }) {
        newObject[target.name] = target.value === 'false' ? false : target.value === 'true' ? true : target.value
        const objectToAdd = JSON.parse(JSON.stringify(newObject))
        setNewObject(objectToAdd)
    }

    function handleExpenseInput({ target }) {
        const name = target.name.split('-')[0]
        const idx = target.name.split('-')[1]
        newObject.expenses[idx][name] = target.type === 'number' ? +target.value : target.value
        const objectToAdd = JSON.parse(JSON.stringify(newObject))
        setNewObject(objectToAdd)
    }

    function handleSelect({ target }) {
        if (target.value === 'new') {
            setIsNewType(true)
            return
        }
        setIsNewType(false)
        newObject[target.name] = target.value
        const objectToAdd = JSON.parse(JSON.stringify(newObject))
        setNewObject(objectToAdd)
    }

    function addNewExpense() {
        newObject.expenses.push({ desc: '', paid: 0, type: '' })
        const objectToAdd = JSON.parse(JSON.stringify(newObject))
        setNewObject(objectToAdd)
    }

    function removeExpense(idx) {
        const newExpenses = newObject.expenses.filter((expense, eId) => eId !== idx)
        newObject.expenses = newExpenses
        const objectToAdd = JSON.parse(JSON.stringify(newObject))
        setNewObject(objectToAdd)
    }

    function onAddfunc(ev) {
        ev.preventDefault()
        if (!newObject.desc || !newObject.paid || !newObject.type) {
            setShowMsgModal({ txt: 'נא למלא את כל השדות' })
            return
        }
        addFunc(newObject)
    }

    useEffect(() => {
        setMyExpenses(loggedUser.expenses)
    }, [loggedUser])

    function handleErrMsg(msg) {
        setShowMsgModal(msg)
        setTimeout(() => setShowMsgModal(false), 2500)
    }

    return (
        <>
            {/* Modal Backdrop */}
            <div className="modal-backdrop" onClick={() => setShowAdd(false)} />
            
            {/* Modal Content */}
            <section className="add-new-modal" onClick={(ev) => ev.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="header-content">
                        <div className="modal-icon">
                            <Plus size={24} />
                        </div>
                        <div className="header-text">
                            <h2>הוספת הוצאה חדשה</h2>
                            <p>מלא את הפרטים להוספת ההוצאה</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setShowAdd(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    <form onSubmit={(ev) => onAddfunc(ev)}>
                        {/* Date Input */}
                        <div className="form-group">
                            <label htmlFor="date" className="form-label">
                                <Calendar size={18} />
                                תאריך
                            </label>
                            <input 
                                className="form-input date-input" 
                                type="date" 
                                name="date" 
                                id="date"
                                value={newObject.date} 
                                onInput={handleInput}
                                required
                            />
                        </div>

                        {/* Description Input */}
                        <div className="form-group">
                            <label htmlFor="desc" className="form-label">
                                <Tag size={18} />
                                תיאור ההוצאה
                            </label>
                            <input 
                                type="text" 
                                name="desc" 
                                id="desc" 
                                className="form-input"
                                placeholder="למשל: קניות בסופר"
                                required 
                                onInput={handleInput} 
                            />
                        </div>

                        {/* Amount Input */}
                        <div className="form-group">
                            <label htmlFor="paid" className="form-label">
                                <DollarSign size={18} />
                                סכום (₪)
                            </label>
                            <input 
                                type="number" 
                                name="paid" 
                                id="paid" 
                                className="form-input amount-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required 
                                onInput={handleInput} 
                            />
                        </div>

                        {/* Payment Type Select */}
                        <div className="form-group">
                            <label htmlFor="pType" className="form-label">
                                <CreditCard size={18} />
                                צורת תשלום
                            </label>
                            <div className="select-wrapper">
                                <select 
                                    name="pType" 
                                    id="pType" 
                                    className="form-select"
                                    required 
                                    onInput={handleInput}
                                    defaultValue="cash"
                                >
                                    <option value="cash">מזומן</option>
                                    <option value="card">אשראי</option>
                                    <option value="transfer">העברה בנקאית</option>
                                    <option value="other">אחר</option>
                                </select>
                            </div>
                        </div>

                        {/* Expense Type Select/Input */}
                        {expenseTypes.length > 0 && (
                            <div className="form-group">
                                <label htmlFor="type" className="form-label">
                                    <Tag size={18} />
                                    קטגוריה
                                </label>
                                <div className="select-wrapper">
                                    <select 
                                        name="type" 
                                        id="type" 
                                        className="form-select"
                                        required 
                                        onInput={handleSelect}
                                    >
                                        <option value="new">קטגוריה חדשה</option>
                                        {expenseTypes.map((type, idx) => (
                                            <option value={type} key={idx}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* New Type Input */}
                        {(expenseTypes.length === 0 || isNewType) && (
                            <div className="form-group">
                                <label htmlFor="newType" className="form-label">
                                    <Tag size={18} />
                                    קטגוריה חדשה
                                </label>
                                <input 
                                    type="text" 
                                    name="type" 
                                    id="newType" 
                                    className="form-input"
                                    placeholder="למשל: מזון, תחבורה, בילויים"
                                    required 
                                    onInput={handleInput} 
                                />
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-secondary" 
                                onClick={() => setShowAdd(false)}
                            >
                                ביטול
                            </button>
                            <button 
                                type="submit" 
                                className="btn-primary"
                            >
                                <Plus size={18} />
                                הוסף הוצאה
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {showMsgModal && (
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{showMsgModal.txt}</span>
                    </div>
                )}
            </section>
        </>
    )
}
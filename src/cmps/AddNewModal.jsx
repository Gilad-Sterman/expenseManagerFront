import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export function AddNewModal({ type, addFunc, objectToAdd, setShowAdd }) {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    const [newObject, setNewObject] = useState(objectToAdd)
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
            setNewClient(true)
            return
        }
        setNewClient(false)
        const myClient = clients.find(client => client.id === target.value)
        newObject[target.name] = myClient
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
        addFunc(newObject)
    }

    useEffect(() => {
        setMyExpenses(loggedUser.expenses)
    }, [loggedUser])

    return (
        <section className="add-new-modal" onClick={(ev) => ev.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAdd(false)}>
                <img src="https://res.cloudinary.com/dollaguij/image/upload/v1699194245/svg/x_ti24ab.svg" alt="" />
            </button>
            <h3>{`הוספת הוצאה`}</h3>
            {<form>
                <input className="date-input" type="date" name="date" value={newObject.date} onInput={handleInput} />
                <div className="my-input">
                    <label htmlFor="desc">תיאור</label>
                    <input type="text" name="desc" id="desc" onInput={handleInput} />
                </div>
                <div className="my-input">
                    <label htmlFor="paid">שולם</label>
                    <input type="number" name="paid" id="paid" onInput={handleInput} />
                </div>
                <div className="my-input">
                    <label htmlFor="type">סוג</label>
                    <input type="text" name="type" id="type" onInput={handleInput} />
                </div>
                {/* {newObject.expenses.length > 1 && <span className="remove-expense" onClick={() => removeExpense(idx)}>מחיקת הוצאה -</span>} */}
                {/* <span className="add-new-expense" onClick={() => addNewExpense()}>הוספת הוצאה +</span> */}
                {/* {!!myExpenses.length && <button onClick={(ev) => onAddfunc(ev)}>הוספה</button>} */}
                <button onClick={(ev) => onAddfunc(ev)}>הוספה</button>
            </form>}
        </section>
    )
}
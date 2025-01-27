import { useSelector } from "react-redux"
import { utilService } from "../services/util.service"
import { useEffect, useState } from "react"
import { months } from "../services/expense.service"
import { MySelect } from "../cmps/MySelect"
import { NavLink, useNavigate } from "react-router-dom"
import { Chart } from "../cmps/Chart"
import { useSwipeable } from "react-swipeable";

export function Home() {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    const [eByMonth, setEByMonth] = useState(null)
    const [eByType, setEByType] = useState(null)
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [currentChart, setCurrentChart] = useState("Doughnut")
    const [selectedTab, setSelectedTab] = useState("Total")
    const [totalsByMonth, setTotalsByMonth] = useState(0)

    useEffect(() => {
        if (!loggedUser) {
            navigate('/login')
        } else {
            getData()
        }
    }, [loggedUser, navigate])

    useEffect(() => {
        if (loggedUser) {
            getData()
        }
    }, [month, selectedTab])

    function getData() {
        const doughnutData = utilService.getDataFromUser(loggedUser, month)
        const barData = utilService.getDataByMonthFromUser(loggedUser, selectedTab)
        const totals = utilService.getTotalsForMonth(loggedUser.expenses, month)
        setEByMonth(barData)
        setEByType(doughnutData)
        setTotalsByMonth(totals)
    }

    const greeting = utilService.getGreeting()

    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentChart("Bar"),
        onSwipedRight: () => setCurrentChart("Doughnut"),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true, // Allow swiping with a mouse as well
    })

    const handleTabClick = (tab) => {
        setSelectedTab(tab)
    }

    const getTypeData = (type) => {
        return {
            labels: eByMonth.labels,
            datasets: [{
                label: type,
                data: eByMonth.labels.map((label) => {
                    const expenseForType = loggedUser.expenses.filter(exp => exp.type === type && exp.date.split('-')[1] === label);
                    return expenseForType.reduce((sum, expense) => sum + expense.paid, 0);
                }),
                backgroundColor: '#36A2EB',
            }]
        }
    }
    return (
        <section className="home-page" {...handlers}>
            <section className="hero">
                <h2>{`${greeting} ${loggedUser?.username}!`}</h2>
            </section>
            {loggedUser.expenses.length > 0 && <MySelect options={months} selected={month} setSelected={setMonth} />}
            {loggedUser?.expenses.length === 0 && <section className="no-expenses">
                <h3>אין הוצאות {`:(`}</h3>
                <button className="new-expense">
                    <NavLink to={'/expenses'}>
                        הוספת הוצאה חדשה
                    </NavLink>
                </button>
            </section>}
            {eByType && eByMonth && loggedUser.expenses.length > 0 && (
                <section className="chart-container">
                    {currentChart === "Doughnut" && (
                        <>
                            <div
                                className={`chart-arrow left ${currentChart === "Doughnut" ? "visible" : ""
                                    }`}
                                onClick={() => setCurrentChart("Bar")}
                            >
                                →
                            </div>
                            <Chart type={"Doughnut"} className={"expenses-by-type"} data={eByType} />
                        </>
                    )}
                    {currentChart === "Bar" && (
                        <>
                            <div
                                className={`chart-arrow right ${currentChart === "Bar" ? "visible" : ""
                                    }`}
                                onClick={() => setCurrentChart("Doughnut")}
                            >
                                ←
                            </div>

                            {/* Tabs for Bar Chart */}
                            <div className="tabs">
                                <div
                                    className={`tab ${selectedTab === "Total" ? "active" : ""}`}
                                    onClick={() => handleTabClick("Total")}
                                >
                                    סה"כ
                                </div>
                                {Array.from(new Set(loggedUser?.expenses.map(exp => exp.type))).map((type) => (
                                    <div
                                        key={type}
                                        className={`tab ${selectedTab === type ? "active" : ""}`}
                                        onClick={() => handleTabClick(type)}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>

                            {/* Display corresponding chart based on selected tab */}
                            {selectedTab === "Total" ? (
                                <Chart type={"Bar"} className={"expenses-by-month"} data={eByMonth} />
                            ) : (
                                <Chart
                                    type={"Bar"}
                                    className={"expenses-by-type"}
                                    data={eByMonth} // For a specific type, filter data accordingly
                                />
                            )}
                        </>
                    )}
                </section>
            )}
            {loggedUser.expenses.length > 0 && <section className="total-this-month">
                <h4><span>סה"כ הוצאות החודש:</span> {totalsByMonth || 0} ₪</h4>
            </section>}
        </section>
    )
}
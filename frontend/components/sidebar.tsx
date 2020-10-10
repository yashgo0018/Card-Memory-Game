const Sidebar = ({ clicks, playerBest, globalBest, newGame }) => {
    return <div className="md:block flex ">
        <div className="my-3 mr-3">Clicks: {clicks}</div>
        <div className="my-3 mr-3">My Best: {playerBest}</div>
        <div className="my-3 mr-3">Global Best: {globalBest}</div>
        <div className="my-3"><button onClick={newGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">New Game</button></div>
    </div>
}

export default Sidebar;
import Router from 'next/router';
import { Component } from 'react';
import Layout from '../components/layout';
import Sidebar from '../components/sidebar';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { startNewGame } from '../services/game';

const HOSTNAME = "localhost";

class HomePage extends Component {
    client: W3CWebSocket;

    constructor(props) {
        super(props);
        this.client = new W3CWebSocket(`ws://${HOSTNAME}:8000/api/game`);
    }

    state = {
        clicks: 0,
        globalBest: 0,
        playerBest: 0,
        cards: [
            {
                id: 0,
                value: 0
            },
            {
                id: 1,
                value: 0
            },
            {
                id: 2,
                value: 0
            },
            {
                id: 3,
                value: 0
            },
            {
                id: 4,
                value: 0
            },
            {
                id: 5,
                value: 0
            },
            {
                id: 6,
                value: 0
            },
            {
                id: 7,
                value: 0
            },
            {
                id: 8,
                value: 0
            },
            {
                id: 9,
                value: 0
            },
            {
                id: 10,
                value: 0
            },
            {
                id: 11,
                value: 0
            },
        ]
    }

    componentDidMount() {
        if (localStorage.getItem("expiration") && new Date(parseInt(localStorage.getItem("expiration"))) < new Date()) {
            Router.push('/login');
        } else {
            startNewGame();
            this.client.onopen = () => {
                this.client.send(localStorage.getItem("token"))
            }
            this.client.onmessage = (message) => {
                const msg = message.data.toString();
                if (msg.startsWith("Global Best is ")) {
                    this.setState({ globalBest: parseInt(msg.slice(15)) })
                    return;
                }
                if (msg.startsWith("Player Best is ")) {
                    this.setState({ playerBest: parseInt(msg.slice(15)) });
                    return;
                }
                const data = JSON.parse(msg);
                const { cards } = this.state;

                cards[data.pos].value = data.value;
                const counter = [0, 0, 0, 0, 0, 0, 0];
                let filteredCards = cards.filter(card => card.value != 0);
                filteredCards.forEach(card => counter[card.value] += 1);
                const sum = counter.reduce((a, b) => a + b);
                this.setState({ cards, clicks: data.clicks });
                if (sum % 2 == 0) {
                    for (const card of cards) {
                        if (counter[card.value] == 1) {
                            setTimeout(() => {
                                const { cards } = this.state;
                                cards[card.id].value = 0;
                                this.setState({ cards });
                            }, 500);
                        }
                    }
                }
            }
        }
    }

    cardClick = (card: number) => {
        this.client.send(`click ${card}`);
    }

    newGame = () => {
        startNewGame();
        const cards = [];
        for (let index = 0; index < 12; index++) {
            cards.push({ id: index, value: 0 });
        }
        this.setState({ cards, clicks: 0 });
    }

    render() {
        const { cards, clicks, playerBest, globalBest } = this.state;
        return <Layout>
            <div className="text-gray-700 body0font container px-5 py-8 mx-auto">
                <div className="py-8 flex flex-wrap md:flex-no-wrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                        <Sidebar clicks={clicks} playerBest={playerBest} globalBest={globalBest} newGame={this.newGame} />
                    </div>
                    <div className="md:flex-grow">
                        <div className="flex flex-wrap mb-4">
                            {cards.map((card) =>
                                card.value == 0 ?
                                    <div className="md:w-1/5 sm:w-1/4 w-1/3 mr-10 mb-10" key={card.id} style={{ height: '220px', backgroundColor: '#543', borderRadius: '10px', boxShadow: '10px 10px 20px #432' }} onClick={() => { this.cardClick(card.id) }}></div>
                                    :
                                    <div className="w-1/5 mr-10 mb-10" key={card.id} style={{ height: '220px', backgroundColor: '#987', textAlign: 'center', verticalAlign: 'middle', lineHeight: '220px', fontSize: '50px', fontWeight: 'bold', color: '#000', borderRadius: '10px', boxShadow: '10px 10px 20px #432' }}>{card.value}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    }
}

export default HomePage;

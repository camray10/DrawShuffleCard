import React, { useState, useEffect } from "react"
import axios from "axios";
import Card from "./Card";
import "./CardDeck.css"

const CARD_DECK_URL = "https://deckofcardsapi.com/api/deck";

function CardDeck() {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [shuffle, setShuffle] = useState(false);

useEffect(function renderDeckAPI(){
    async function fetchData(){
        const d = await axios.get(`${CARD_DECK_URL}/new/shuffle/`);
        setDeck(d.data);
    }
    fetchData();
}, []);

async function drawCard(){
    try{
        const drawRes = await axios.get(`${CARD_DECK_URL}/${deck.deck_id}/draw/`);
        if (drawRes.data.remaining === 0) throw new Error("Out of Cards!");

        const card = drawRes.data.cards[0];

        setDrawn(d => [...d,{
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image,
        },
        ]);
    } catch (err){
        alert(err);
    }
}

async function shuffleCard(){
    setShuffle(true);
    try{
        await axios.get(`${CARD_DECK_URL}/${deck.deck_id}/shuffle/`);
        setDrawn([]);
    }catch(err){
        alert(err);
    } finally{
        setShuffle(false);
    }
}

function renderDrawButton(){
    if(!deck) return null;
    return(
        <button className="deck-button"
        onClick={drawCard}
        disabled={shuffle}>
            Draw a Card
        </button>
    )
}
function renderShuffleButton(){
    if(!deck) return null;
    return(
        <button className="deck-button"
        onClick={shuffleCard}
        disabled={shuffle}>
            Shuffle the Deck
        </button>
    );
}

return(
    <main className="deck">
        {renderDrawButton()}
        {renderShuffleButton()}
    
    <div className="deck-area">{
        drawn.map(c => (
            <Card key={c.id} name={c.name} image={c.image} />
        ))}
    </div>
    </main>
);
}

export default CardDeck;
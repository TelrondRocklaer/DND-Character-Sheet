"use client";

import React, {useState} from 'react';
import DiceRoller from '../components/dice-roller';

export default function Home() {
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [rollName, setRollName] = useState('');
  const [dice, setDice] = useState('');
  const [diceComponentKey, setDiceComponentKey] = useState(0);
  const [tempRollKey, setTempRollKey] = useState(-1);
  const [rollHistory, setRollHistory] = useState<{key: number, name: string, diceInfo: string, result: number}[]>([]);

  const handleRollDice = () => {
    setDiceComponentKey(diceComponentKey + 1);
    setShowDiceRoller(true);
  };

  const handleClose = (result: number) => {
    if (tempRollKey === -1) {
      setRollHistory([...rollHistory, {key: diceComponentKey, name: rollName, diceInfo: dice, result: result }]);
    }
    else {
      setTempRollKey(-1);
    }
    setShowDiceRoller(false);
  };

  const handleRollHistoryClick = (key: number) => {
    setTempRollKey(key);
    setRollName(rollHistory[key - 1].name);
    setDice(rollHistory[key - 1].diceInfo);
    setShowDiceRoller(true);
  }

  return (
    <div>

      <div>
        <DiceRoller key={diceComponentKey} rollName={rollName} diceInfo={dice}
                    isVisible={showDiceRoller} getResult={handleClose}
        />
      </div>

      <div>
        <button
          onClick={() => {
            setRollName('Perception Check');
            setDice('d20+d4+5');
            handleRollDice();
          }}
        >
          Roll Perception Check
        </button>
      </div>

      <div>
        <h2>Roll History</h2>
        <ul>
          {rollHistory.map((roll) => (
            <li key={roll.key}>
              Roll {roll.key}: {roll.result}
              <button onClick={() => handleRollHistoryClick(roll.key)}>Show result</button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
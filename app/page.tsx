"use client";

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import DiceRoller from '../components/dice-roller';
import {AnimatePresence, motion} from 'framer-motion';

export default function Home() {
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [rollName, setRollName] = useState('');
  const [dice, setDice] = useState('');
  const [diceComponentKey, setDiceComponentKey] = useState(0);
  const [tempRollKey, setTempRollKey] = useState(-1);
  const [rollHistory, setRollHistory] = useState<{ key: number, name: string, result: number }[]>([]);
  const [showRollHistory, setShowRollHistory] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleRollDice = () => {
    setDiceComponentKey(diceComponentKey + 1);
    setShowDiceRoller(true);
  };

  const handleClose = (result: number) => {
    if (tempRollKey === -1) {
      setRollHistory([...rollHistory, {key: diceComponentKey, name: rollName, result: result}]);
    } else {
      setTempRollKey(-1);
    }
    setShowDiceRoller(false);
  };

  const handleRollHistoryClick = (key: number) => {
    const roll = rollHistory.find((r) => r.key === key);
    if (roll) {
      setTempRollKey(key);
      setRollName(roll.name);
      setShowDiceRoller(true);
    }
  };

  return (
    <div>

      <div>
        <DiceRoller key={tempRollKey !== -1 ? tempRollKey : diceComponentKey} rollName={rollName} diceInfo={dice}
                    isVisible={showDiceRoller} getResult={handleClose}
                    rollKey={tempRollKey !== -1 ? tempRollKey : diceComponentKey}
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

      <motion.button
        className="fixed bottom-5 right-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
        onClick={() => rollHistory.length !== 0 ? setShowRollHistory(!showRollHistory) : undefined}
        whileHover={{scale: 1.1}}
      >
        <Image src="roll-history.svg" alt="Rule Book" width={45} height={45}/>
      </motion.button>

      <AnimatePresence>
        {showRollHistory && (
          <motion.div className="fixed bottom-20 right-5 w-96 h-32 p-4 rounded flex items-center justify-center overflow-hidden"
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeInOut" } }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut" } }}
          >
            <Image src="/main-sheet/Bonds & Ideals.svg" alt="Background" className="object-contain" width={384}
                   height={128}/>
            <ul className="absolute inset-0 flex flex-col items-center justify-center overflow-y-scroll">
              {rollHistory.map((roll) => (
                <li className="text-xl" key={roll.key} onClick={() => handleRollHistoryClick(roll.key)}>
                  {roll.name}: {roll.result === -20 ? "NAT 20" : roll.result === -1 ? "NAT 1" : roll.result}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
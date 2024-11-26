"use client";

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import PlayerCharacter from '../models/player-character';
import DiceRoller from '../components/dice-roller';
import {AnimatePresence, motion} from 'framer-motion';

export default function Home() {
  const [playerCharacter, setPlayerCharacter] = useState<PlayerCharacter>();
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [rollName, setRollName] = useState('');
  const [dice, setDice] = useState('');
  const [advantage, setAdvantage] = useState<boolean | undefined>(undefined);
  const [diceComponentKey, setDiceComponentKey] = useState(0);
  const [tempRollKey, setTempRollKey] = useState(-1);
  const [rollHistory, setRollHistory] = useState<{ key: number, name: string, result: number }[]>([]);
  const [showRollHistory, setShowRollHistory] = useState(false);

  useEffect(() => {
    setPlayerCharacter(new PlayerCharacter('1'));
    sessionStorage.clear();
    // const character = localStorage.getItem('playerCharacter');
    // if (character) {
    //   setCharacter(JSON.parse(character));
    // }
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

  // noinspection PointlessBooleanExpressionJS
  return (
    <div>

      <DiceRoller key={tempRollKey !== -1 ? tempRollKey : diceComponentKey} rollName={rollName} diceInfo={dice}
                  isVisible={showDiceRoller} getResult={handleClose} advantage={advantage}
                  rollKey={tempRollKey !== -1 ? tempRollKey : diceComponentKey}
      />

      {playerCharacter && (
        <div className="flex flex-col justify-start items-start m-5">
          <div className="flex flex-row">
            <div className="flex flex-row space-x-5 mb-5">
              {playerCharacter.attributes.getAttributes().map((attribute) => (
                <div className="flex flex-col items-center justify-center" key={attribute.name}>
                  <Image src="/main-sheet/Attribute.svg" alt="Attribute" className="object-contain" width={100}
                         height={100}/>
                  <div className="absolute flex flex-col items-center justify-center"
                       onClick={() => {
                         setRollName(`${attribute.name} Check`);
                         setDice('d20' + (attribute.modifier() == 0 ? "" : (attribute.modifier() > 0 ? "+" : "") + attribute.modifier()));
                         setAdvantage(attribute.advantageOnChecks);
                         handleRollDice();
                       }}
                  >
                    <div className="text-xs">{attribute.name.toUpperCase()}</div>
                    <div
                      className="text-4xl mt-2">{attribute.modifier() == 0 ? 0 : (attribute.modifier() > 0 ? "+" : "") + attribute.modifier()}</div>
                    <div className="text-xl mt-3">{attribute.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Image src="/main-sheet/Saving Throws.svg" alt="Saving Throws" width={220} height={220}
                   className="object-contain"/>
            <div className="flex flex-row space-x-5 absolute">
              <div className="flex flex-col">
                {playerCharacter.attributes.getAttributes().map((attribute) => (
                  <div className="flex flew-row items-center justify-stretch space-x-2" key={attribute.name}>
                    <div className={`w-4 h-4 rounded-full border border-primary
                      ${attribute.proficientInSavingThrows ? 'bg-green-500' : ''}`}
                    >
                    </div>
                    <div className={`w-4 h-4 rounded-full border border-primary ${attribute.advantageOnSavingThrows === undefined ?
                      "" : (attribute.advantageOnSavingThrows === true ? 'bg-green-500' : 'bg-red-500')}`}
                    >
                    </div>
                    <div className="text-xs">{attribute.shortName}</div>
                    <div className="text-xl">
                      {attribute.modifier() == 0 ? 0 : (attribute.modifier() > 0 ? "+" : "") + attribute.modifier()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <motion.button
          className="fixed bottom-5 right-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
          onClick={() => rollHistory.length !== 0 ? setShowRollHistory(!showRollHistory) : undefined}
          whileHover={{scale: 1.1}}
        >
          <Image src="roll-history.svg" alt="roll-history" width={45} height={45}/>
        </motion.button>

        <AnimatePresence>
          {showRollHistory && (
            <motion.div className="fixed bottom-20 right-5 w-96 h-28 p-4 rounded flex items-center justify-center"
                        exit={{opacity: 0, scale: 0.95, transition: {duration: 0.3, ease: "easeInOut"}}}
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1, transition: {duration: 0.3, ease: "easeInOut"}}}
            >
              <Image src="/main-sheet/Bonds & Ideals.svg" alt="Bonds & Ideals" className="object-contain" fill/>
              <ul className="absolute inset-0 flex flex-col items-center justify-start overflow-y-scroll my-1">
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

    </div>
  );
}
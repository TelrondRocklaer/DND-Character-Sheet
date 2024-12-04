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
  const [healDamageDiv, setHealDamageDiv] = useState<boolean | undefined>(undefined);
  const [healDamageAmount, setHealDamageAmount] = useState(0);

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

  const handleClose = (result: number, inspirationUsed: boolean) => {
    if (tempRollKey === -1) {
      setRollHistory([...rollHistory, {key: diceComponentKey, name: rollName, result: result}]);
      if (inspirationUsed) {
        if (playerCharacter) {
          setPlayerCharacter({...playerCharacter, inspiration: false});
        }
      }
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
                  rollKey={tempRollKey !== -1 ? tempRollKey : diceComponentKey} inspiration={playerCharacter?.inspiration}
      />

      <div className={(showDiceRoller ? "hidden" : "")}>
        {playerCharacter && (
          <div className="flex flex-col justify-start items-start m-5 select-none">

            <div className="flex flex-row">
              <div className="flex flex-row space-x-5 mb-5">

                {/* Attributes */}
                {playerCharacter.attributes.getAttributes().map((attribute) => (
                  <motion.div className="flex flex-col items-center justify-center" key={attribute.name}
                              whileHover={{scale: 1.05}}
                  >
                    <Image src="/main-sheet/Attribute.svg" alt="Attribute" className="object-contain w-24 h-auto" width={0}
                           height={0} priority={true}/>
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
                  </motion.div>
                ))}

                {/* Movement Speed */}
                <div className="flex flex-col items-center">
                  <Image src="/main-sheet/Saving Throws.svg" alt="Saving Throws" width={0} height={0}
                         className="object-contain w-28 h-auto" priority={true}/>
                  <div className="absolute flex flex-col items-center mt-1.5">
                    <div className="text-xs">MOVEMENT SPEED</div>
                    <div className="text-4xl mt-1.5">{playerCharacter.movementSpeed} ft.</div>
                  </div>
                </div>

                {/* Inspiration and Proficiency Bonus */}
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center">
                    <Image src="/main-sheet/Inspiration.svg" alt="Saving Throws" width={0} height={0}
                           className="object-contain w-48 h-auto" priority={true}/>
                    <div className="absolute flex flex-row items-center">
                      <Image src={(playerCharacter.inspiration ? "/" : "/no-") + "inspiration-sunrise.svg"}
                             alt="inspiration-sunrise" width={50} height={50}/>
                      <div className="text-xs ml-3">INSPIRATION</div>
                      <motion.div whileHover={{scale: 1.05}}>
                        <Image src="/plus.svg" alt="Plus" width={20} height={20} className="ml-3"
                          onClick={() => setPlayerCharacter({...playerCharacter, inspiration: true})}
                        />
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <Image src="/main-sheet/Proficiency Bonus.svg" alt="Proficiency Bonus" width={0} height={0}
                           className="object-contain w-48 h-auto" priority={true}/>
                    <div className="absolute flex flex-row items-center">
                      <div className="text-4xl ml-2.5 mb-1">{"+" + playerCharacter.proficiencyBonus()}</div>
                      <div className="text-xs ml-4">PROFICIENCY BONUS</div>
                    </div>
                  </div>
                </div>

                {/* HP */}
                <div className="flex flex-col items-center">
                  <Image src="/main-sheet/HP Top.svg" alt="HP Top" width={0} height={0}
                         className="object-contain w-72 h-auto" priority={true}/>
                  <div className="absolute flex flex-row m-2 space-x-5">
                    <div className="flex flex-col justify-center">
                      <motion.div className="border border-primary text-xs p-1 m-0.5 text-center"
                                  whileHover={{scale: 1.05}}
                                  onClick={() => setHealDamageDiv(true)}
                      >
                        Heal
                      </motion.div>
                      <div className="flex flex-row items-center">
                        <input type="number" value={healDamageAmount} disabled={healDamageDiv === undefined}
                               onChange={(e) => setHealDamageAmount(+e.target.value)}
                               className={"bg-background text-xl p-1 text-center w-9 outline-none " +
                                 "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" +
                                 (healDamageDiv === undefined ? " opacity-0" : "")}
                        />
                        <button className={"text-xs text-center" + (healDamageDiv === undefined ? " opacity-0" : "")}
                                disabled={healDamageDiv === undefined}
                                onClick={() => {
                                  if (healDamageAmount === 0) {
                                    return;
                                  }
                                  if (healDamageDiv === true) {
                                    if (playerCharacter.currentHitPoints + healDamageAmount > playerCharacter.maxHitPoints) {
                                      setPlayerCharacter({...playerCharacter, currentHitPoints: playerCharacter.maxHitPoints});
                                    }
                                    else {
                                      setPlayerCharacter({...playerCharacter, currentHitPoints: playerCharacter.currentHitPoints + healDamageAmount});
                                    }
                                  } else {
                                    if (playerCharacter.temporaryHitPoints > 0) {
                                      if (playerCharacter.temporaryHitPoints - healDamageAmount < 0) {
                                        setPlayerCharacter({...playerCharacter, currentHitPoints: playerCharacter.currentHitPoints - healDamageAmount, temporaryHitPoints: 0});
                                      } else {
                                        setPlayerCharacter({...playerCharacter, temporaryHitPoints: playerCharacter.temporaryHitPoints - healDamageAmount});
                                      }
                                    } else {
                                      setPlayerCharacter({...playerCharacter, currentHitPoints: playerCharacter?.currentHitPoints - healDamageAmount});
                                    }
                                  }
                                  setHealDamageDiv(undefined);
                                  setHealDamageAmount(0);
                                }}
                        >
                          OK
                        </button>
                      </div>
                      <motion.div className="border border-primary text-xs p-1 m-0.5 text-center"
                                  whileHover={{scale: 1.05}}
                                  onClick={() => setHealDamageDiv(false)}
                      >
                        Damage
                      </motion.div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <table>
                        <thead>
                        <tr>
                          <th className="text-xs">CURRENT</th>
                          <th className="p-2"></th>
                          <th className="text-xs">MAX</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td className="text-4xl text-center">{playerCharacter.currentHitPoints}</td>
                          <td className="text-4xl">/</td>
                          <td className="text-4xl text-center">{playerCharacter.maxHitPoints}</td>
                        </tr>
                        </tbody>
                      </table>
                      <div className="text-xs font-semibold mt-4">HIT POINTS</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-bold">TEMP HP</div>
                      <div className="text-4xl">{playerCharacter.temporaryHitPoints}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex flex-row space-x-5">
              <div className="flex flex-col">

                {/* Saving Throws */}
                <div className="flex flex-col items-center justify-start">
                  <Image src="/main-sheet/Saving Throws.svg" alt="Saving Throws" width={0} height={0}
                         className="object-contain w-56 h-auto" priority={true}/>
                  <div className="flex flex-col absolute">
                    <table>
                      <thead>
                      <tr>
                        <th className="text-[0.6rem]">PROF</th>
                        <th className="text-[0.6rem] p-0.5">MOD</th>
                        <th className="text-[0.6rem] p-0.5">BONUS</th>
                      </tr>
                      </thead>
                      <tbody>
                      {playerCharacter.attributes.getAttributes().map((attribute) => (
                        <motion.tr key={attribute.name} onClick={() => {
                          setRollName(`${attribute.name} Saving Throw`);
                          setDice('d20' + (attribute.modifier() == 0 ? "" : (attribute.modifier() > 0 ? "+" : "") + attribute.modifier()));
                          setAdvantage(attribute.advantageOnSavingThrows);
                          handleRollDice();
                        }}
                                   whileHover={{scale: 1.05}}
                        >
                          <td className="p-1">
                            <div className={`w-3 h-3 rounded-full border border-primary
                          ${attribute.proficientInSavingThrows ? 'bg-green-500' : ''}`}>
                            </div>
                          </td>
                          <td className="text-xs text-center">{attribute.shortName}</td>
                          <td className="text-xs text-center">
                            {attribute.modifier() == 0 ? 0 : (attribute.modifier() > 0 ? "+" : "") + attribute.modifier()}
                          </td>
                        </motion.tr>
                      ))}
                      </tbody>
                    </table>
                    <div className="flex flex-row items-center justify-center mt-6">
                      <div className="text-xs font-semibold">SAVING THROWS</div>
                    </div>
                  </div>
                </div>

                {/* Senses */}
                <div className="flex flex-col items-center justify-center mt-5">
                  <Image src="/main-sheet/Saving Throws.svg" alt="Saving Throws" width={0} height={0}
                         className="object-contain w-56 h-auto" priority={true}/>
                  <div className="flex flex-col space-y-5 absolute">
                    <div className="flex flex-row">
                      <Image src="/main-sheet/Passive Perception.svg" alt="Passive Perception" width={0} height={0}
                             className="object-contain w-48 h-auto" priority={true}/>
                      <div className="absolute flex flex-row items-center">
                        <div className="text-xl ml-2.5">{playerCharacter.passivePerception()}</div>
                        <div className="text-xs ml-4">PASSIVE PERCEPTION</div>
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <Image src="/main-sheet/Passive Perception.svg" alt="Passive Perception" width={0} height={0}
                             className="object-contain w-48 h-auto" priority={true}/>
                      <div className="absolute flex flex-row items-center">
                        <div className="text-xl ml-2.5">{playerCharacter.passiveInvestigation()}</div>
                        <div className="text-xs ml-4">PASSIVE INVESTIGATION</div>
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <Image src="/main-sheet/Passive Perception.svg" alt="Passive Perception" width={0} height={0}
                             className="object-contain w-48 h-auto" priority={true}/>
                      <div className="absolute flex flex-row items-center">
                        <div className="text-xl ml-2.5">{playerCharacter.passiveInsight()}</div>
                        <div className="text-xs ml-4">PASSIVE INSIGHT</div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-center">
                      <div className="text-xs font-semibold">SENSES</div>
                    </div>
                  </div>
                </div>

                {/* Proficiencies and Languages */}
                <div className="flex flex-col items-center justify-center mt-5">
                  <Image src="/main-sheet/Proficiencies.svg" alt="Proficiencies" width={0} height={0}
                         className="object-contain w-56 h-auto" priority={true}/>
                  <div className="absolute flex flex-col items-center justify-center">
                    <div className="flex flex-row w-full border-b border-primary">
                      <div className="text-xs font-bold">ARMOR</div>
                      <div className="text-xs">
                        {playerCharacter.proficiencies.filter((proficiency) =>
                          proficiency.type.includes("Armor")).join(', ')}
                      </div>
                    </div>
                    <div className="flex flex-row w-full border-b border-primary">
                      <div className="text-xs font-bold">WEAPONS</div>
                      <div className="text-xs">
                        {playerCharacter.proficiencies.filter((proficiency) =>
                          proficiency.type.includes("Weapon")).join(', ')}
                      </div>
                    </div>
                    <div className="flex flex-row w-full border-b border-primary">
                      <div className="text-xs font-bold">TOOLS</div>
                      <div className="text-xs">
                        {playerCharacter.proficiencies.filter((proficiency) =>
                          proficiency.type.includes("Tool")).join(', ')}
                      </div>
                    </div>
                    <div className="flex flex-row w-full">
                      <div className="text-xs font-bold">LANGUAGES</div>
                      <hr/>
                      <div className="text-xs">
                        {playerCharacter.proficiencies.filter((proficiency) =>
                          proficiency.type === 'Language').join(', ')}
                      </div>
                    </div>
                    <div className="flex flex-row items-center mt-5">
                      <div className="text-xs font-semibold">PROFICIENCIES AND LANGUAGES</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Skills */}
              <div className="flex flex-col items-center relative">
                <Image src="/main-sheet/Skills.svg" alt="Skills" width={0} height={0}
                       className="object-contain w-56 h-auto" priority={true}/>
                <div className="absolute flex flex-col">
                  <table>
                    <thead>
                    <tr>
                      <th className="text-[0.6rem]">PROF</th>
                      <th className="text-[0.6rem] p-0.5">MOD</th>
                      <th className="text-[0.6rem] p-0.5">SKILL</th>
                      <th className="text-[0.6rem] p-0.5">BONUS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {playerCharacter.attributes.getSkills().map((skill) => (
                      <motion.tr key={skill.name} onClick={
                        () => {
                          setRollName(`${skill.name} Check`);
                          setDice('d20' + (skill.parentAttribute.modifier() == 0 ? "" : (skill.parentAttribute.modifier() > 0 ? "+" : "") + skill.parentAttribute.modifier()) +
                            (skill.proficient ? "+" + playerCharacter.proficiencyBonus() : ""));
                          setAdvantage(skill.advantageOnChecks);
                          handleRollDice();
                        }}
                                 whileHover={{scale: 1.05}}
                      >
                        <td className="p-1">
                          <div
                            className={`w-3 h-3 rounded-full border border-primary ${skill.proficient ? 'bg-green-500' : ''}`}>
                          </div>
                        </td>
                        <td className="text-xs p-1">{skill.parentAttribute.shortName}</td>
                        <td className="text-xs p-1">{skill.name}</td>
                        <td className="text-xs text-center p-1">{skill.parentAttribute.modifier() +
                        (skill.proficient ? playerCharacter.proficiencyBonus() : 0) > 0 ? "+" : ""}
                          {skill.parentAttribute.modifier() + (skill.proficient ? playerCharacter.proficiencyBonus() : 0)}
                        </td>
                      </motion.tr>
                    ))}
                    </tbody>
                  </table>
                  <div className="flex flex-row justify-center mt-8">
                    <div className="text-xs font-semibold">SKILLS</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Roll history */}
        <div>
          <motion.button
            className="fixed bottom-5 right-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
            onClick={() => rollHistory.length !== 0 ? setShowRollHistory(!showRollHistory) : undefined}
            whileHover={{scale: 1.1}}
          >
            <Image src="roll-history.svg" alt="roll-history" width={45} height={45} priority={true}/>
          </motion.button>

          <AnimatePresence>
            {showRollHistory && (
              <motion.div className="fixed bottom-20 right-5 w-96 h-28 p-4 rounded flex items-center justify-center"
                          exit={{opacity: 0, scale: 0.95, transition: {duration: 0.3, ease: "easeInOut"}}}
                          initial={{opacity: 0, scale: 0.95}}
                          animate={{opacity: 1, scale: 1, transition: {duration: 0.3, ease: "easeInOut"}}}
              >
                <Image src="/main-sheet/Bonds & Ideals.svg" alt="Bonds & Ideals" className="object-contain" fill priority={true}/>
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
    </div>
  );
}
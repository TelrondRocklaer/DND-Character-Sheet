"use client";

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import PlayerCharacter from '../models/player-character';
import DiceRoller from '../components/dice-roller';
import {AnimatePresence, motion} from 'framer-motion';
import ApiRequests from "@/app/api-requests";
import usePlayerCharacterStore from "@/stores/player-character-store";
import {permanentRedirect} from "next/navigation";
import {DamageType} from "@/models/resistance";
import Spell from "@/models/spell";

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
  const [showCustomRoll, setShowCustomRoll] = useState(false);
  const [customDice, setCustomDice] = useState('');
  const [tempHPDiv, setTempHPDiv] = useState<boolean | undefined>(undefined);
  const [tempHPAmount, setTempHPAmount] = useState(0);
  const [healDamageAmount, setHealDamageAmount] = useState(0);
  const [showHealDamageMenu, setShowHealDamageMenu] = useState(false);
  const menuItems = ["Combat", "General", "Notes"];
  const [clickedMenuItem, setClickedMenuItem] = useState("General");
  const playerCharacterStore = usePlayerCharacterStore();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState<{ title: string, content: string }>({title: '', content: ''});
  const [newNote, setNewNote] = useState<{ title: string, content: string }>({title: '', content: ''});

  useEffect(() => {
    async function fetchPC() {
      const pcId = localStorage.getItem("selectedCharacter");
      if (!pcId) {
        permanentRedirect("/login");
      }
      const data = await ApiRequests.fetchPlayerCharacter(pcId);
      setPlayerCharacter(data);
    }

    fetchPC();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (playerCharacter) {
      playerCharacterStore.setPlayerCharacter(playerCharacter);
    }
  }, [playerCharacter]);

  const handleRollDice = () => {
    setDiceComponentKey(diceComponentKey + 1);
    setShowDiceRoller(true);
  };

  const handleClose = (result: number, inspirationUsed: boolean) => {
    if (tempRollKey === -1) {
      setRollHistory([...rollHistory, {key: diceComponentKey, name: rollName, result: result}]);
      if (inspirationUsed) {
        if (playerCharacter) {
          setPlayerCharacter({
            ...playerCharacter,
            inspiration: false,
            toJSON: playerCharacter.toJSON.bind(playerCharacter)
          });
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

  const savePlayerCharacter = async () => {
    if (playerCharacter) {
      await ApiRequests.savePlayerCharacter(playerCharacter);
    }
  }

  return (
    <div>

      <DiceRoller key={tempRollKey !== -1 ? tempRollKey : diceComponentKey} rollName={rollName} diceInfo={dice}
                  isVisible={showDiceRoller} getResult={handleClose} advantage={advantage}
                  rollKey={tempRollKey !== -1 ? tempRollKey : diceComponentKey}
                  inspiration={playerCharacter?.inspiration}
      />

      <div className={(showDiceRoller ? "hidden" : "")}>
        {playerCharacter && (
          <motion.div className="flex flex-col items-center m-5 select-none"
                      initial={{opacity: 0}} animate={{opacity: 1}}
                      transition={{type: "tween", ease: "anticipate", duration: 0.5}}
          >

            <div className="flex flex-row">
              <div className="flex flex-row space-x-5 mb-5">

                {/* Attributes */}
                {playerCharacter.attributes.getAttributes().map((attribute) => (
                  <motion.div className="flex flex-col items-center justify-center" key={attribute.name}
                              whileHover={{scale: 1.05}}
                  >
                    <Image src="/main-sheet/Attribute.svg" alt="Attribute" className="object-contain w-24 h-auto"
                           width={0} height={0} priority={true}
                    />
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
                      {!playerCharacter.inspiration &&
                          <motion.button whileHover={{scale: 1.05}}>
                              <Image src="/plus.svg" alt="Plus" width={20} height={20} className="ml-3"
                                     onClick={() => setPlayerCharacter({
                                       ...playerCharacter,
                                       inspiration: true,
                                       toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                     })}
                              />
                          </motion.button>
                      }
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
                      <motion.button className="border border-primary text-xs p-1 m-0.5 text-center"
                                     whileHover={{scale: 1.05}}
                                     onClick={() => setTempHPDiv(true)}
                      >
                        Add
                      </motion.button>
                      <div className="flex flex-row items-center">
                        <input type="number" value={tempHPAmount} disabled={tempHPDiv === undefined}
                               onChange={(e) => setTempHPAmount(+e.target.value)}
                               className={"bg-background text-xl p-1 text-center w-9 outline-none " +
                                 "[appearance:textField] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" +
                                 (tempHPDiv === undefined ? " opacity-0" : "")}
                        />
                        <button className={"text-xs text-center" + (tempHPDiv === undefined ? " opacity-0" : "")}
                                disabled={tempHPDiv === undefined}
                                onClick={() => {
                                  if (tempHPAmount === 0) {
                                    return;
                                  }
                                  if (tempHPDiv === true) {
                                    setPlayerCharacter({
                                      ...playerCharacter,
                                      temporaryHitPoints: playerCharacter.temporaryHitPoints + tempHPAmount,
                                      toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                    });
                                  }
                                  else {
                                    if (playerCharacter.temporaryHitPoints - tempHPAmount < 0) {
                                      setPlayerCharacter({
                                        ...playerCharacter,
                                        temporaryHitPoints: 0,
                                        toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                      });
                                    }
                                    else {
                                      setPlayerCharacter({
                                        ...playerCharacter,
                                        temporaryHitPoints: playerCharacter.temporaryHitPoints - tempHPAmount,
                                        toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                      });
                                    }
                                  }
                                  setTempHPDiv(undefined);
                                  setTempHPAmount(0);
                                }}
                        >
                          OK
                        </button>
                      </div>
                      <motion.button className="border border-primary text-xs p-1 m-0.5 text-center"
                                     whileHover={{scale: 1.05}}
                                     onClick={() => setTempHPDiv(false)}
                      >
                        Remove
                      </motion.button>
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
                  <div className="flex flex-col absolute mt-1">
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
                          setDice('d20' + (attribute.modifier() == 0 ? "" : (attribute.modifier() > 0 ? "+" : "") + attribute.modifier())
                            + (attribute.proficientInSavingThrows ? "+" + playerCharacter.proficiencyBonus() : ""));
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
                            {(attribute.modifier() + (attribute.proficientInSavingThrows ? playerCharacter.proficiencyBonus() : 0)) === 0
                              ? 0
                              : (attribute.modifier() + (attribute.proficientInSavingThrows ? playerCharacter.proficiencyBonus() : 0) > 0
                              ? "+"
                              : "") + (attribute.modifier() + (attribute.proficientInSavingThrows ? playerCharacter.proficiencyBonus() : 0))}
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
                <div className="flex flex-col items-center mt-5">
                  <Image src="/main-sheet/Proficiencies.svg" alt="Proficiencies" width={0} height={0}
                         className="object-contain w-56 h-auto" priority={true}/>
                  <div className="absolute flex flex-col mt-2 w-48">
                    <div className="flex flex-col w-full border-b border-primary">
                      <div className="text-xs font-bold">ARMOR</div>
                      <div className="text-xs break-all">
                        {playerCharacter.allArmorProficiencies ? "All" : (playerCharacter.armorProficiencies.size !== 0)
                          ? Array.from(playerCharacter.armorProficiencies).map(armorType => armorType.name).join(', ')
                          : "None"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full border-b border-primary">
                      <div className="text-xs font-bold">WEAPONS</div>
                      <div className="text-xs break-all">
                        {playerCharacter.simpleWeaponProficiencies ? "Simple" : playerCharacter.martialWeaponProficiencies ? "Martial" : ""}
                        {(playerCharacter.weaponProficiencies.size !== 0)
                          ? Array.from(playerCharacter.weaponProficiencies).filter(wt => {
                            if (playerCharacter.simpleWeaponProficiencies) {
                              return !wt.isMartial;
                            }
                            if (playerCharacter.martialWeaponProficiencies) {
                              return wt.isMartial;
                            }
                          }).map(weaponType => weaponType.name).join(', ')
                          : (playerCharacter.simpleWeaponProficiencies || playerCharacter.martialWeaponProficiencies) ? "" : "None"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full border-b border-primary">
                      <div className="text-xs font-bold">TOOLS</div>
                      <div className="text-xs break-all">
                        {playerCharacter.allToolProficiencies ? "All tools" : (playerCharacter.toolProficiencies.size !== 0)
                          ? Array.from(playerCharacter.toolProficiencies).map(tool => tool.name).join(', ')
                          : "None"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-xs font-bold">LANGUAGES</div>
                      <div className="text-xs break-all">
                        {(playerCharacter.languages.size !== 0) ? Array.from(playerCharacter.languages).map(language => language.name).join(', ') : "None"}
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="text-xs font-semibold">PROFICIENCIES AND LANGUAGES</div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex flex-col items-center">

                {/* Skills */}
                <div className="flex flex-row relative">
                  <Image src="/main-sheet/Skills.svg" alt="Skills" width={0} height={0}
                         className="object-contain w-56 h-auto" priority={true}/>
                  <div className="absolute flex flex-col mt-1 ml-5">
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

                {/* Rests */}
                <div className="flex flex-col items-center justify-center mt-5">
                  <Image src="/main-sheet/HP Bottom.svg" alt="HP Bottom" width={0} height={0}
                         className="object-contain w-56 h-auto" priority={true}/>
                  <div className="absolute">
                    <motion.button className="flex flex-row items-center"
                                   whileHover={{scale: 1.05}}
                    >
                      <Image src="/short-rest-campfire.svg" alt="short-rest-campfire" width={35} height={35}
                             className="object-contain" priority={true}/>
                      <div className="text-xs">SHORT REST</div>
                    </motion.button>
                    <motion.button className="flex flex-row items-center"
                                   whileHover={{scale: 1.05}}
                                   onClick={() => playerCharacter.longRest()}
                    >
                      <Image src="/long-rest-moon.svg" alt="long-rest-moon" width={35} height={35}
                             className="object-contain" priority={true}/>
                      <div className="text-xs">LONG REST</div>
                    </motion.button>
                  </div>
                </div>

              </div>

              {/* Info Menu */}
              <div className="h-[554px] w-[850px]">
                <div
                  className="flex flex-row justify-center space-x-5 border-t-2 border-l-2 border-r-2 border-primary rounded-t-full">
                  {menuItems.map((item) => (
                    <motion.button className="relative w-24 h-12 my-2"
                                   whileHover={{scale: 1.05}} key={item}
                                   onClick={() => setClickedMenuItem(item)}
                    >
                      <Image src="/main-sheet/Coin Extra.svg" alt="Coin Extra" fill className="object-contain"/>
                      <div className="absolute inset-0 w-full text-xs flex items-center justify-center text-center
                        border border-background"
                      >
                        {item.toUpperCase()}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="size-full border-2 border-primary overflow-y-scroll">
                  <AnimatePresence mode={"wait"}>
                    {clickedMenuItem === "Combat" && (
                      <motion.div key="combat" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                  transition={{type: "tween", ease: "anticipate", duration: 0.5}}
                      >
                        <div className="p-4">
                          <div className="flex flex-row space-x-10 border-b border-primary">
                            <motion.div className="flex flex-col items-center justify-center mb-2 relative"
                                        onClick={() => {
                                          setRollName(`Initiative Roll`);
                                          setDice('d20' + (playerCharacter.initiative() == 0 ? "" : (playerCharacter.initiative() > 0 ? "+" : "") + playerCharacter.initiative()));
                                          setAdvantage(playerCharacter.attributes.dexterity.advantageOnChecks);
                                          handleRollDice();
                                        }}
                                        whileHover={{scale: 1.05}}
                            >
                              <div className="text-xs text-center">INITIATIVE</div>
                              <Image src="/main-sheet/Inspiration (Head).svg" alt="Inspiration (Head)" width={0}
                                     height={0}
                                     className="object-contain w-auto h-24" priority={true}
                              />
                              <div
                                className="absolute text-6xl text-center">{playerCharacter.initiative() > 0 ? ("+" + playerCharacter.initiative()) : playerCharacter.initiative()}</div>
                            </motion.div>
                            <div className="flex flex-col items-center justify-center mb-2 relative">
                              <div className="text-xs text-center">ARMOR CLASS</div>
                              <Image src="/main-sheet/Armor Class.svg" alt="Armor Class" width={0} height={0}
                                     className="object-contain w-auto h-24" priority={true}
                              />
                              <div className="absolute text-6xl text-center">{playerCharacter.armorClass}</div>
                            </div>
                            {playerCharacter.class && (
                              <div className="flex flex-col items-center justify-center mb-2 relative">
                                <div className="text-xs text-center">HIT DICE</div>
                                <Image src={"/dice/" + playerCharacter.class.hitDie + ".svg"} alt="Hit Dice"
                                       width={0} height={0} className="object-contain w-auto h-24" priority={true}
                                />
                                <div className="absolute text-6xl text-center">{playerCharacter.hitDieCount}</div>
                              </div>
                            )}
                            <div className="grid grid-cols-7 grid-rows-2 space-x-3 mb-2">
                              {playerCharacter.resistances.getAll().map((damageType: DamageType) => (
                                <div key={damageType.damageType}
                                     className="flex flex-col items-center justify-center group"
                                >
                                  <Image src={"/damage-types/" + damageType.damageType + ".svg"}
                                         alt={damageType.damageType}
                                         width={0} height={0} className="object-contain w-14 h-auto group-hover:hidden"
                                         priority={true}
                                  />
                                  <div className="hidden group-hover:block">
                                    {(damageType.immune || damageType.resistant || damageType.vulnerable) && (
                                      <Image
                                        src={"/damage-types/" + (damageType.immune ? "immunity" : damageType.resistant ? "resistance" : damageType.vulnerable ? "vulnerability" : "") + ".svg"}
                                        alt="resistance" width={0} height={0} className="object-contain w-10 h-auto"
                                        priority={true}
                                      />
                                    )}
                                    <div className="text-xs text-center">{damageType.damageType}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="border-b border-primary">
                            <div className="text-2xl">Armor</div>
                            {playerCharacter.equippedArmor.map(armor => (
                              <div key={armor.id} className="flex flex-col ml-5 mb-2">
                                <div className="text-xl">{armor.name} ({armor.armorType ? armor.armorType.name : ""},
                                  AC: {armor.baseArmorClass}, {armor.cost} GP, {armor.weight} Lb)
                                </div>
                                <div className="text-xs">{armor.description}</div>
                              </div>
                            ))}
                          </div>
                          <div className="border-b border-primary">
                            <div className="text-2xl">Weapons</div>
                            <table className="ml-5">
                              <tbody>
                              {playerCharacter.equippedWeapons.filter(w => w.weaponType !== undefined).map(weapon => (
                                <tr key={weapon.id}>
                                  <td className="text-xl p-3">{weapon.name}</td>
                                  <td
                                    className="text-xl p-3">{weapon.weaponType.baseDamage} {weapon.weaponType.damageType}</td>
                                  <td
                                    className="text-xl p-3">{weapon.weaponType.properties.map(p => p.name + " (" + p.extraInfo + ")").join(', ')}</td>
                                  <motion.td className="p-3 cursor-pointer text-xl"
                                             onClick={() => {
                                               setRollName(`${weapon.name} Attack Roll`);
                                               const properties = weapon.weaponType.properties.map(p => p.name);
                                               setDice('d20' + ((properties.includes("Ranged") || properties.includes("Finesse") || properties.includes("Thrown")) ? (playerCharacter.attributes.dexterity.modifier() == 0 ? "" : (playerCharacter.attributes.dexterity.modifier() > 0 ? "+" : "") + playerCharacter.attributes.dexterity.modifier())
                                                   : (playerCharacter.attributes.strength.modifier() == 0 ? "" : (playerCharacter.attributes.strength.modifier() > 0 ? "+" : "") + playerCharacter.attributes.strength.modifier()))
                                                 + (playerCharacter.weaponProficiencies.has(weapon.weaponType) ? "+" + playerCharacter.proficiencyBonus() : "") + "+" + weapon.magicBonus + (playerCharacter.weaponAttackRollBonus > 0 ? "+" + playerCharacter.weaponAttackRollBonus : playerCharacter.weaponAttackRollBonus)
                                               );
                                               handleRollDice();
                                             }}
                                             whileHover={{scale: 1.05}}
                                  >
                                    Attack roll
                                  </motion.td>
                                  <motion.td className="p3 cursor-pointer text-xl"
                                             onClick={() => {
                                               setRollName(`${weapon.name} Damage Roll`);
                                               setDice(weapon.weaponType.baseDamage + "+" + (weapon.magicBonus > 0 ? "+" + weapon.magicBonus : weapon.magicBonus));
                                               handleRollDice();
                                             }}
                                             whileHover={{scale: 1.05}}
                                  >
                                    Damage roll
                                  </motion.td>
                                </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="border-b border-primary">
                            <div className="text-2xl">Spells</div>
                            <div className="flex flex-col ml-5">
                              {Array.from(playerCharacter.spells).map((spell: Spell) => (
                                <div key={spell.id} className="flex flex-col mb-2">
                                  <div className="text-xl">{spell.name} ({spell.spellSlotLevel})</div>
                                  <div className="text-xs">{spell.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) || clickedMenuItem === "General" && (
                      <motion.div key="general" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                  transition={{type: "tween", ease: "anticipate", duration: 0.5}}
                      >
                        <div className="flex flex-col space-y-2 p-4">
                          <div className="border-b border-primary grid grid-cols-2">
                            <div>
                              <div className="text-2xl">{playerCharacter.name}, level {playerCharacter.level}</div>
                              {playerCharacter.class && (
                                <div className="text-2xl">
                                  {playerCharacter.class.name}{playerCharacter.subclass ? ("(" + playerCharacter.subclass.name + ")") : ""}
                                </div>
                              )}
                              {playerCharacter.subclass && (
                                <div className="text-xs">{playerCharacter.subclass.description}</div>
                              )}
                            </div>
                            {playerCharacter.class && (
                              <div className="flex justify-end">
                                <Image src={"/class-icons/Class Icon - " + playerCharacter.class.name + ".svg"}
                                       alt={playerCharacter.class.name} width={200} height={200} priority={true}
                                       className="mb-2"
                                />
                              </div>
                            )}
                          </div>
                          {playerCharacter.race && (
                            <div className="border-b border-primary">
                              <div className="text-2xl">Race: {playerCharacter.race.name}</div>
                              <div className="text-xl">Size: {playerCharacter.race.size}</div>
                              <div className="text-xl">{playerCharacter.race.fullDescription}</div>
                            </div>
                          )}
                          {playerCharacter.subrace && (
                            <div className="border-b border-primary">
                              <div className="text-2xl">Subrace: {playerCharacter.subrace.name}</div>
                              <div className="text-xl">{playerCharacter.subrace.description}</div>
                            </div>
                          )}
                          {playerCharacter.background && (
                            <div className="border-b border-primary">
                              <div className="text-2xl">Background: {playerCharacter.background.name}</div>
                              <div className="text-xl">{playerCharacter.background.description}</div>
                            </div>
                          )}
                          {playerCharacter.feats && playerCharacter.feats.size > 0 && (
                            <div className="border-b border-primary">
                              <div className="text-2xl">Feats</div>
                              {Array.from(playerCharacter.feats).map((feat) => (
                                <div key={feat.id}>
                                  <div className="text-xs">{feat.name}</div>
                                  <div className="text-xs">{feat.description}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) || clickedMenuItem === "Notes" && (
                      <motion.div key="notes" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                  transition={{type: "tween", ease: "anticipate", duration: 0.5}}
                      >
                        <div className="flex flex-col space-y-4">
                          <div className="p-4 bg-background rounded-lg w-full">
                            <input
                              type="text"
                              placeholder="New note title"
                              value={newNote.title}
                              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                              className="w-full p-2 mb-2 border border-primary rounded-md bg-background outline-none"
                            />
                            <textarea
                              placeholder="New note content"
                              value={newNote.content}
                              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                              className="w-full p-2 border border-primary rounded-md bg-background outline-none"
                            />
                            <button className="mt-2 p-2 bg-primary text-background rounded-md w-full" onClick={() => {
                              if (playerCharacter && newNote.title !== '' && newNote.content !== '') {
                                const updatedNotes = [...playerCharacter.notes, newNote];
                                setPlayerCharacter({
                                  ...playerCharacter,
                                  notes: updatedNotes,
                                  toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                });
                                setNewNote({title: '', content: ''});
                              }
                            }}>
                              Create Note
                            </button>
                          </div>
                          <AnimatePresence>
                            <div className="grid grid-cols-3 gap-10 mx-10">
                              {playerCharacter?.notes.map((note, index) => (
                                <motion.div key={index} initial={{opacity: 0}} animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{type: 'tween', ease: 'anticipate', duration: 0.5}}
                                            className="p-2 border-b border-primary flex flex-col bg-background rounded-lg"
                                >
                                  {editingIndex === index ? (
                                    <div className="flex flex-col space-y-2">
                                      <input
                                        type="text"
                                        value={editedNote.title}
                                        onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
                                        className="w-full p-2 border border-primary rounded-md bg-background outline-none"
                                      />
                                      <textarea
                                        value={editedNote.content}
                                        onChange={(e) => setEditedNote({...editedNote, content: e.target.value})}
                                        className="w-full p-2 border border-primary rounded-md bg-background outline-none"
                                      />
                                      <div className="flex space-x-2">
                                        <button className="p-2 bg-secondary text-background rounded-md"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (playerCharacter && editingIndex !== null && editedNote.title !== '' && editedNote.content !== '') {
                                                    const updatedNotes = [...playerCharacter.notes];
                                                    updatedNotes[editingIndex] = editedNote;
                                                    setPlayerCharacter({
                                                      ...playerCharacter,
                                                      notes: updatedNotes,
                                                      toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                                    });
                                                    setEditingIndex(null);
                                                  }
                                                }}>
                                          Save
                                        </button>
                                        <button className="p-2 bg-secondary text-background rounded-md"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingIndex(null);
                                                }}>
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div onClick={() => {
                                      setEditingIndex(index);
                                      setEditedNote(playerCharacter?.notes[index] || {title: '', content: ''});
                                    }}>
                                      <h3
                                        className="font-bold text-primary">{note.title.slice(0, 30)}{note.title.length > 29 ? "..." : ""}</h3>
                                      <p
                                        className="text-secondary">{note.content.slice(0, 20)}{note.content.length > 19 ? "..." : ""}</p>
                                      <button className="mt-2 p-2 bg-primary text-background rounded-md"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (playerCharacter) {
                                                  const updatedNotes = playerCharacter.notes.filter((_, i) => i !== index);
                                                  setPlayerCharacter({
                                                    ...playerCharacter,
                                                    notes: updatedNotes,
                                                    toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                                  });
                                                }
                                              }}>
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* Roll history */}
            <div>
              <motion.button
                className="fixed bottom-5 right-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                onClick={() => {
                  if (rollHistory.length !== 0) {
                    setShowRollHistory(!showRollHistory);
                  }
                  setShowCustomRoll(false);
                }}
                whileHover={{scale: 1.1}}
              >
                <Image src="/roll-history.svg" alt="roll-history" width={45} height={45} priority={true}/>
              </motion.button>

              <AnimatePresence>
                {showRollHistory && (
                  <motion.div className="fixed bottom-20 right-5 w-96 h-28 p-4 rounded flex items-center justify-center"
                              exit={{opacity: 0, scale: 0.95, transition: {duration: 0.3, ease: "easeInOut"}}}
                              initial={{opacity: 0, scale: 0.95}}
                              animate={{opacity: 1, scale: 1, transition: {duration: 0.3, ease: "easeInOut"}}}
                  >
                    <Image src="/main-sheet/Bonds & Ideals.svg" alt="Bonds & Ideals" className="object-contain" fill
                           priority={true}/>
                    <ul className="absolute inset-0 flex flex-col items-center justify-start overflow-y-scroll my-1">
                      {rollHistory.map((roll) => (
                        <motion.li className="text-xl" key={roll.key} onClick={() => handleRollHistoryClick(roll.key)}
                                   whileHover={{scale: 1.05}}
                        >
                          {roll.name}: {roll.result === -20 ? "NAT 20" : roll.result === -1 ? "NAT 1" : roll.result}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom roll button */}
            <div>
              <motion.button
                className="fixed bottom-5 right-20 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                onClick={() => {
                  setShowCustomRoll(!showCustomRoll);
                  setShowRollHistory(false);
                }}
                whileHover={{scale: 1.1}}
              >
                <Image src="/custom-roll.svg" alt="custom-roll" width={45} height={45} priority={true}/>
              </motion.button>
              <AnimatePresence>
                {showCustomRoll && (
                  <motion.div className="fixed bottom-20 right-5 w-96 h-28 p-4 rounded flex items-center justify-center"
                              exit={{opacity: 0, scale: 0.95, transition: {duration: 0.3, ease: "easeInOut"}}}
                              initial={{opacity: 0, scale: 0.95}}
                              animate={{opacity: 1, scale: 1, transition: {duration: 0.3, ease: "easeInOut"}}}
                  >
                    <Image src="/main-sheet/Bonds & Ideals.svg" alt="Bonds & Ideals" className="object-contain" fill
                           priority={true}/>
                    <div className="absolute flex flex-col items-center justify-start w-full p-6">
                      <input type="text" placeholder="Dice" value={customDice}
                             onChange={(e) => setCustomDice(e.target.value)}
                             className="w-full p-2 mb-2 border border-primary rounded-md bg-background outline-none"
                      />
                      <button className="p-2 bg-primary text-background rounded-md w-full"
                              onClick={() => {
                                setRollName("Custom roll");
                                setDice(customDice);
                                handleRollDice();
                                setShowCustomRoll(false);
                                setCustomDice('');
                              }}
                      >
                        Roll
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save button */}
            <div>
              <motion.button
                className="fixed top-20 right-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                onClick={savePlayerCharacter}
                whileHover={{scale: 1.1}}
              >
                <Image src="/save.svg" alt="save" width={45} height={45} priority={true}/>
              </motion.button>
            </div>

            {/* Profile button */}
            <div>
              <motion.button
                className="fixed top-5 right-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                onClick={() => permanentRedirect("/profile")}
                whileHover={{scale: 1.1}}
              >
                <Image src="/profile.svg" alt="profile" width={45} height={45} priority={true}/>
              </motion.button>
            </div>

            {/* Heal / Damage menu */}
            <div>
              <motion.button
                className="fixed top-5 right-20 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                onClick={() => {
                  setShowHealDamageMenu(!showHealDamageMenu);
                }}
                whileHover={{scale: 1.1}}
              >
                <Image src="/slashing-dark.svg" alt="slashing-dark" width={35} height={35} priority={true}/>
              </motion.button>
              <AnimatePresence>
                {showHealDamageMenu && (
                  <motion.div className="fixed top-20 right-5 w-96 h-28 p-4 rounded flex items-center justify-center"
                              exit={{opacity: 0, scale: 0.95, transition: {duration: 0.3, ease: "easeInOut"}}}
                              initial={{opacity: 0, scale: 0.95}}
                              animate={{opacity: 1, scale: 1, transition: {duration: 0.3, ease: "easeInOut"}}}
                  >
                    <Image src="/main-sheet/Bonds & Ideals.svg" alt="Bonds & Ideals" className="object-contain" fill
                           priority={true}/>
                    <div className="absolute inset-0 flex flex-col items-center justify-start overflow-y-scroll p-4">
                      <input type="number" value={healDamageAmount}
                             onChange={(e) => setHealDamageAmount(+e.target.value)}
                             className={"p-2 mb-2 w-32 border border-primary rounded-md bg-background outline-none "
                               + "[appearance:textField] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
                      />
                      <div className="grid grid-cols-7 grid-rows-2 space-x-3">
                        {playerCharacter.resistances.getAll().map((damageType: DamageType) => (
                          <div key={damageType.damageType}
                               className="flex flex-col items-center justify-center group"
                               onClick={() => {
                                 if (damageType.immune) {
                                   setHealDamageAmount(0);
                                 }
                                 else if (damageType.resistant) {
                                   setHealDamageAmount(Math.ceil(healDamageAmount / 2));
                                 }
                                 else if (damageType.vulnerable) {
                                   setHealDamageAmount(healDamageAmount * 2);
                                 }
                                 if (playerCharacter.temporaryHitPoints > 0) {
                                   if (playerCharacter.temporaryHitPoints - healDamageAmount < 0) {
                                     setPlayerCharacter({
                                       ...playerCharacter,
                                       currentHitPoints: playerCharacter.currentHitPoints - healDamageAmount + playerCharacter.temporaryHitPoints,
                                       temporaryHitPoints: 0,
                                       toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                     });
                                   }
                                   else {
                                     setPlayerCharacter({
                                       ...playerCharacter,
                                       temporaryHitPoints: playerCharacter.temporaryHitPoints - healDamageAmount,
                                       toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                     });
                                   }
                                 }
                                 else {
                                   setPlayerCharacter({
                                     ...playerCharacter,
                                     currentHitPoints: playerCharacter.currentHitPoints - healDamageAmount,
                                     toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                   });
                                 }
                                 setShowHealDamageMenu(false);
                                 setHealDamageAmount(0);
                               }}
                          >
                            <Image src={"/damage-types/" + damageType.damageType + ".svg"}
                                   alt={damageType.damageType}
                                   width={0} height={0} className="object-contain w-12 h-auto group-hover:hidden"
                                   priority={true}
                            />
                            <div className="hidden group-hover:block">
                              <div className="text-xs text-center">{damageType.damageType}</div>
                            </div>
                          </div>
                        ))}
                        <div className="flex flex-col items-center justify-center group"
                             onClick={() => {
                               if (playerCharacter.currentHitPoints + healDamageAmount > playerCharacter.maxHitPoints) {
                                 setPlayerCharacter({
                                   ...playerCharacter,
                                   currentHitPoints: playerCharacter.maxHitPoints,
                                   toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                 });
                               } else {
                                 setPlayerCharacter({
                                   ...playerCharacter,
                                   currentHitPoints: playerCharacter.currentHitPoints + healDamageAmount,
                                   toJSON: playerCharacter.toJSON.bind(playerCharacter)
                                 });
                               }
                               setShowHealDamageMenu(false);
                               setHealDamageAmount(0);
                             }}
                        >
                          <Image src="/plus.svg" alt="plus" width={0} height={0}
                                 className="object-contain w-12 h-auto group-hover:hidden" priority={true}
                          />
                          <div className="hidden group-hover:block">
                            <div className="text-xs text-center">heal</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
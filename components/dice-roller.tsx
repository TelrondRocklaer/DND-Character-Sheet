"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface DiceRollerProps {
  rollName?: string;
  diceInfo: string;
  advantage?: boolean;
  isVisible: boolean;
  rollKey: number;
  inspiration?: boolean;
  getResult?: (result: number, inspirationUsed: boolean) => void;
}

const parseDiceInfo = (diceInfo: string) => {
  const input = diceInfo.split(/(?=[+-])/).map(String);
  return input.map(die => {
    const isNegative = die.startsWith('-');
    let cleanDie = die.replace(/[+-]/, '');
    if (cleanDie.includes("d")) {
      if (cleanDie.startsWith("d")) {
        cleanDie = "1" + cleanDie;
      }
      return [Number(cleanDie.split("d")[0]), Number(cleanDie.split("d")[1]), isNegative] as [number, number, boolean];
    } else {
      return [0, Number(cleanDie), isNegative];
    }
  });
};

const rollSingleDie = (sides: number) => Math.floor(Math.random() * sides) + 1;

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

const diceVariants = {
  hidden: { opacity: 0, y: 20, rotate: 0 },
  visible: { opacity: 1, y: 0, rotate: 360 },
};

const resultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// noinspection JSUnusedGlobalSymbols
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = 1 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5 },
        opacity: { delay, duration: 0.01 }
      }
    };
  }
};

export default function DiceRoller({ rollName, diceInfo, advantage: initialAdvantage, isVisible, rollKey, inspiration, getResult }: DiceRollerProps) {
  const [mainRollResults, setMainRollResults] = useState<{ result: number, sides: number }[] | null>(null);
  const [extraRollResults, setExtraRollResults] = useState<{ result: number, sides: number }[] | null>(null);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [modifier, setModifier] = useState<number>(0);
  const [advantage, setAdvantage] = useState<boolean | undefined>(initialAdvantage);
  const [naturalRoll, setNaturalRoll] = useState<boolean | null>(null);
  const [aAColor, setAAColor] = useState("#494949")
  const [dAAColor, setDAColor] = useState("#494949")
  const [lastClick, setLastClick] = useState<boolean | undefined>(undefined);
  const [inspirationUsed, setInspirationUsed] = useState<boolean>(false);

  useEffect(() => {
    const storedRoll = sessionStorage.getItem("Roll" + rollKey);
    if (storedRoll) {
      const { mainRollResults, extraRollResults, totalResult, modifier, naturalRoll } = JSON.parse(storedRoll);
      setMainRollResults(mainRollResults);
      setExtraRollResults(extraRollResults);
      setTotalResult(totalResult);
      setModifier(modifier);
      setNaturalRoll(naturalRoll);
    }
  }, [rollKey]);

  const rollDice = useCallback(() => {
    const dice = parseDiceInfo(diceInfo) as [number, number, boolean][];
    const mainTotal: { result: number, sides: number }[] = [];
    const otherTotal: { result: number, sides: number }[] = [];
    let modifier: number = 0;
    let total: number = 0;
    let natRoll: boolean | null = null;

    dice.forEach(([num, sides, isNegative], index) => {
      if (num === 0) {
        modifier += isNegative ? sides : sides;
      } else {
        for (let i = 0; i < num; i++) {
          const roll1 = rollSingleDie(sides);
          const roll2 = (advantage !== undefined && index === 0 && num === 1) ? rollSingleDie(sides) : null;
          const rollResult = (advantage && roll2) ? Math.max(roll1, roll2!)
            : (advantage === false && roll2) ? Math.min(roll1, roll2!) : roll1;
          const result = isNegative ? -rollResult : rollResult;
          if (index === 0 && (num === 1 || sides === 20)) {
            mainTotal.push({ result, sides });
            total += result;
            if (roll2 !== null) {
              mainTotal.push({ result: isNegative ? -roll2 : roll2, sides });
            }
            if (rollResult === 20) {
              natRoll = true;
            } else if (rollResult === 1) {
              natRoll = false;
            }
          } else {
            otherTotal.push({ result, sides });
            total += result;
          }
        }
      }
    });

    const singleD20 = dice.filter(([num, sides]) => num === 1 && sides === 20).length === 1;
    if (!singleD20) {
      natRoll = null;
    }

    setMainRollResults(mainTotal);
    setExtraRollResults(otherTotal);
    setModifier(modifier);
    setTotalResult(total);
    setNaturalRoll(natRoll);
  }, [diceInfo, advantage]);

  const renderRollResults = (rollResults: { result: number, sides: number }[], chunkSize: number) => (
    chunkArray(rollResults, chunkSize).map((chunk, chunkIndex) => (
      <div key={chunkIndex} className="flex flex-row items-center mb-4 space-x-4">
        {chunk.map((roll, index) => (
          <motion.div key={index}
                      className={(rollResults.length < 6 ? "relative w-32 h-32" : "relative w-16 h-16")}
                      initial="hidden" animate="visible" variants={diceVariants}
                      transition={{ duration: 0.5, delay: (chunkIndex * chunkSize + index) * 0.05 }}
          >
            <Image src={"/dice/d" + roll.sides + ".svg"} className="object-contain" fill alt="Dice" />
            <p className="absolute inset-0 flex items-center justify-center text-center">{roll.result}</p>
          </motion.div>
        ))}
      </div>
    ))
  );

  useEffect(() => {
    if (initialAdvantage === undefined && advantage === undefined) {
      setAAColor("#494949")
      setDAColor("#494949")
    }
    else if ((initialAdvantage || !initialAdvantage) && advantage === undefined) {
      setAAColor("#84DD63")
      setDAColor("#FF4D4D")
    }
    else if ((initialAdvantage === undefined || initialAdvantage) && advantage === true) {
      setAAColor("#84DD63")
      setDAColor("#494949")
    }
    else if ((initialAdvantage === undefined || !initialAdvantage) && advantage === false) {
      setAAColor("#494949")
      setDAColor("#FF4D4D")
    }
    else if ((initialAdvantage === undefined && advantage === true && lastClick) ||
             (initialAdvantage === undefined && advantage === false && !lastClick)) {
      setLastClick(undefined)
      setAAColor("#494949")
      setDAColor("#494949")
      setInspirationUsed(false)
    }
  }, [initialAdvantage, advantage, lastClick])

  if (!isVisible) {
    return null;
  }
  return (
    <div className="fixed flex flex-col items-center bg-background size-full z-50 select-none">
      {rollName && <h2 className="text-3xl mt-10">{rollName} ({diceInfo})</h2>}
      {mainRollResults !== null && inspiration === true && !inspirationUsed &&
          <motion.div className="text-2xl mt-2 z-10" whileHover={{scale: 1.05}}
                      onClick={() => {
                        setInspirationUsed(true)
                        setMainRollResults(null)
                        setExtraRollResults(null)
                      }}
          >
              <Image src={(!inspirationUsed ? "/" : "/no-") + "inspiration-sunrise.svg"} alt="inspiration-sunrise" width={50} height={50} />
          </motion.div>
      }

      {mainRollResults !== null && extraRollResults !== null && (
        <motion.svg className={"top-10 right-10 absolute"}
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    initial="hidden"
                    animate="visible"
                    onClick={() => {
                      if (getResult) {
                        sessionStorage.setItem("Roll" + rollKey, JSON.stringify({ mainRollResults, extraRollResults, totalResult, modifier, naturalRoll }));
                        if (naturalRoll === null) {
                          getResult(totalResult + modifier, inspirationUsed);
                        } else {
                          getResult(naturalRoll ? -20 : -1, inspirationUsed);
                        }
                      }
                    }}
                    whileHover={{scale: 1.1}}
        >
          <motion.line x1="0" y1="0" x2="100" y2="100"
                       stroke="#00cc88" strokeWidth={5} variants={draw}
                       custom={Math.max(mainRollResults.length, extraRollResults.length) * 0.05}
          />
          <motion.line x1="100" y1="0" x2="0" y2="100"
                       stroke="#00cc88" strokeWidth={5} variants={draw}
                       custom={Math.max(mainRollResults.length, extraRollResults.length) * 0.05 + 0.5}
          />
        </motion.svg>
      )}

      <div className="flex flex-col justify-center min-h-screen absolute mt-10">
        {mainRollResults === null && (
          <div className="flex flex-row items-center space-x-32">

            <motion.svg className={"w-64 h-64"}
                        viewBox={"0 0 200 200"}
                        onClick={() => {
                          setLastClick(true)
                          setAdvantage(advantage === true ? undefined : (initialAdvantage === undefined ? true :
                            (advantage === false ? undefined : initialAdvantage)))
                          }
                        }
                        whileHover={{ scale: 1.1 }}
                        animate={aAColor == "#84DD63" ? { y: -50 } : { y: 0 }}
            >
              <motion.line x1="200" y1="200" x2="100" y2="0" stroke={aAColor} strokeWidth={3} />
              <motion.line x1="100" y1="0" x2="0" y2="200" stroke={aAColor} strokeWidth={3} />
              <motion.line x1="200" y1="200" x2="100" y2="100" stroke={aAColor} strokeWidth={3} />
              <motion.line x1="100" y1="100" x2="0" y2="200" stroke={aAColor} strokeWidth={3} />
            </motion.svg>

            <motion.div className="relative w-72 h-72"
                        onClick={rollDice}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                        whileHover={{ rotate: 360, transition: { duration: 0.2 } }}
            >
              <Image src="/dice/d20.svg" className="object-contain" fill alt="d20" />
              <p className="absolute inset-0 flex items-center justify-center text-center text-2xl">Roll</p>
            </motion.div>

            <motion.svg className={"w-64 h-64"}
                        viewBox={"0 0 200 200"}
                        onClick={() => {
                          setLastClick(false)
                          setAdvantage(advantage === false ? undefined : (initialAdvantage === undefined ? false :
                          (advantage === true ? undefined : initialAdvantage)))
                          }
                        }
                        whileHover={{ scale: 1.1 }}
                        animate={dAAColor == "#FF4D4D" ? { y: 50 } : { y: 0 }}
            >
              <motion.line x1="0" y1="0" x2="100" y2="200" stroke={dAAColor}
                           strokeWidth={3} variants={draw} custom={0} />
              <motion.line x1="100" y1="200" x2="200" y2="0" stroke={dAAColor}
                           strokeWidth={3} variants={draw} custom={0.5} />
              <motion.line x1="0" y1="0" x2="100" y2="100" stroke={dAAColor}
                           strokeWidth={3} variants={draw} custom={1} />
              <motion.line x1="100" y1="100" x2="200" y2="0" stroke={dAAColor}
                           strokeWidth={3} variants={draw} custom={1.5} />
            </motion.svg>

          </div>
        )}

        {mainRollResults && extraRollResults && (
          <div className="relative h-[500px] w-[1000px]">
            <Image src={(mainRollResults.length > 3 || extraRollResults.length > 3)
              ? "/main-sheet/Box Rectangle.svg" : "/main-sheet/Box Square.svg"}
                   className="object-contain" fill alt="Box" onClick={rollDice}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-3xl">
              <div className="flex flex-col items-center text-3xl">
                {renderRollResults(mainRollResults, 9)}
              </div>

              <div className="flex flex-col items-center text-3xl">
                {renderRollResults(extraRollResults, 9)}
              </div>

              {totalResult !== 0 && (
                <motion.div className="flex flex-col items-center text-3xl"
                            initial="hidden" animate="visible" variants={resultVariants}
                            transition={{ duration: 0.5, delay: Math.max(mainRollResults.length, extraRollResults.length) * 0.05 + 0.5 }}
                >
                  {modifier !== 0 && <p>Modifier: {modifier > 0 ? "+" + modifier : modifier}</p>}
                  {naturalRoll !== null && <p>{("NAT " + (naturalRoll ? 20 : 1) + " (Total: " + (totalResult + modifier) + ")")}</p>}
                  {naturalRoll === null && <p>Total: {totalResult + modifier}</p>}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
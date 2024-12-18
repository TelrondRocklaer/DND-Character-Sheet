"use client";

import { useEffect, useState } from "react";
import { permanentRedirect } from "next/navigation";
import ApiRequests from "@/app/api-requests";
import { motion } from 'framer-motion';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const data = await ApiRequests.getProfile(token);
      setProfile(data);
    };

    fetchProfile();
  }, []);

  const handleCharacterSelection = (characterId: string) => {
    localStorage.setItem("selectedCharacter", characterId);
    permanentRedirect("/");
  };

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-md p-8 space-y-4 rounded">
        {profile && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-center">Welcome, {profile.username}!</h1>
            <h2 className="text-xl font-semibold text-center">Select Your Character:</h2>
            <ul className="space-y-2">
              {profile.playerCharacters.map((charId: string) => (
                <li key={charId} className="flex justify-center">
                  <motion.button onClick={() => handleCharacterSelection(charId)}
                    className="w-full p-2 mt-1 border border-primary bg-background rounded-md outline-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    Character ID: {charId}
                  </motion.button>
                </li>
              ))}
            </ul>
            <motion.button onClick={() => {
              localStorage.removeItem("selectedCharacter");
              localStorage.removeItem("token");
              permanentRedirect("/login");
            }} className="mt-4"
              whileHover={{ scale: 1.1 }}
            >
              Logout
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
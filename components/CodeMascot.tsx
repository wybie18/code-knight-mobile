import React, { useEffect, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import GamifiedCard from './card/GamifiedCard';

const messages = [
  "Arise, noble coder! The kingdom of logic awaits your wisdom — forge your code like steel upon the anvil of persistence.",
  "Bug dragons may lurk, yet your blade of logic shall strike true — onward, Code Knight!",
  "Every error is but a fallen foe, every fix a victory banner raised upon your castle walls.",
  "With each keystroke, you craft not only code, but your legend in the halls of programming valor.",
  "Fear not the dark dungeons of debugging — for your torch of knowledge shall light the path!",
  "A true knight's strength is patience; a true coder's strength is persistence. You wield both.",
  "Today's quest: conquer confusion, slay procrastination, and emerge victorious with clean code.",
  "Even the grandest castles were built one stone at a time — so too, the greatest projects one line at a time.",
  "Hold firm, Code Knight! For the realm of progress is won through courage and countless commits.",
  "Your shield is logic, your sword is syntax — with them, no challenge can withstand you.",
  "Glitches are but goblins in your path — dispatch them swiftly, and claim your treasure of success.",
  "A knight never abandons his quest; a coder never abandons his project — march on!",
  "The battlefield of bugs grows quiet when your resolve grows strong.",
  "With honor in your heart and code in your hands, you are destined to conquer every algorithmic beast.",
  "Remember, Code Knight: every challenge conquered adds another jewel to your crown of mastery."
];

const CodeMascot = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [cursorOpacity] = useState(new Animated.Value(1));

  // Cursor blinking animation
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    
    return () => blink.stop();
  }, []);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    
    const message = messages[currentMessage];
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex <= message.length) {
        setDisplayedText(message.slice(0, charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentMessage]);

  // Message rotation
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 10000);

    return () => clearInterval(rotateInterval);
  }, []);

  return (
    <GamifiedCard>
      <View className="flex-row items-start">
        {/* Mascot Avatar */}
        <View className="flex-shrink-0 mr-4">
          <View className="relative">
            <Image
              source={require('../assets/images/code_knight_mascot.png')}
              className="w-16 h-16 rounded-full border-2 border-green-400/30"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Speech Bubble */}
        <View className="flex-1">
          <View className="absolute left-0 top-4 w-0 h-0 -translate-x-3 z-10">
            <View 
              className="w-0 h-0 border-l-0 border-r-12 border-t-8 border-b-8"
              style={{
                borderLeftColor: 'transparent',
                borderRightColor: '#334155',
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
              }}
            />
          </View>
          
          <View className="bg-slate-700 rounded-2xl border border-slate-600 shadow-xl overflow-hidden">
            {/* Gradient overlay */}
            <View className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-blue-500/5 rounded-2xl" />
            
            <View className="relative p-5">
              <View style={{ minHeight: 64 }}>
                <Text className="text-white text-sm font-medium leading-relaxed mb-4">
                  {displayedText}
                  {isTyping && (
                    <Animated.Text 
                      className="text-green-400"
                      style={{ opacity: cursorOpacity }}
                    >
                      |
                    </Animated.Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </GamifiedCard>
  );
};

export default CodeMascot;
// components/IngredientSelector.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function IngredientSelector({ selectedIngredients, setSelectedIngredients }) {
  const ingredients = [
    { name: 'Eggs' },
    { name: 'Chicken' },
    { name: 'Potato' },
    { name: 'Onion' },
    { name: 'chole'},
    { name: 'tofu'},
    { name: 'pasta'},
    { name: ' fruits'},
    { name: 'oats'},
    { name: 'kimichi'},
    
  
  ];

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else if (selectedIngredients.length < 3) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  return (
    <View>
      <View className="flex-row justify-center">
        <Text className="text-sm text-red-400">Pick up 2 to 3 ingredients</Text>
      </View>
      <View className="flex-row flex-wrap mt-4">
        {ingredients.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleIngredient(item.name)}
            className={`p-2 rounded-lg m-1 ${selectedIngredients.includes(item.name) ? 'bg-yellow-400' : 'bg-gray-200'}`}
          >
            <Image source={item.image} style={{ width: 30, height: 20 }} />
            <Text className="text-center mt-1">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

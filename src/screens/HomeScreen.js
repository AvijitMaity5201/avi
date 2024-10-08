import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import Categories from '../components/categories';
import Recipes from '../components/recipes';
import IngredientSelector from '../components/IngredientSelector';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const navigation = useNavigation()
  const [activeCategory, setActiveCategory] = useState('Beef');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]); // Default to an empty array
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  const handleChangeCategory = (category) => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
    setSearchQuery(''); // Clear search query when changing categories
  };

  const getCategories = async () => {
    try {
      const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php');
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };

  const getRecipes = async (category = "Beef", ingredient = '') => {
    try {
      let url = ingredient
        ? `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
        : `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`;

      const response = await axios.get(url);
      console.log("API Response:", response.data); // Log API response

      // Check for meals and set to meals state
      if (response && response.data && response.data.meals) {
        setMeals(response.data.meals);
      } else {
        setMeals([]); // Set meals to an empty array if none found
      }
    } catch (err) {
      console.log('error: ', err.message);
      setMeals([]); // Set meals to an empty array in case of an error
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      getRecipes('', text); // Fetch recipes by ingredient
    } else {
      getRecipes(activeCategory); // Fetch recipes for active category when search is cleared
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        {/* Avatar and Bell Icon */}
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Image source={require('../../assets/images/avatar.png')} style={{ height: hp(5), width: hp(5.5) }} />
          <BellIcon size={hp(4)} color="gray" />
        </View>

        {/* Categories */}
        <View>
          {categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
        </View>

        {/* Search Bar */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder='Search any recipe by ingredient'
            placeholderTextColor={'gray'}
            value={searchQuery}
            onChangeText={handleSearch}
            style={{ fontSize: hp(1.7) }}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
          />
          <View className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>

        {/* What's in your fridge Box */}
        <View className="mx-4 bg-amber-500 rounded-[10px] p-1">
          <Text className="text-white text-lg font-bold text-center">What's in your fridge?</Text>
        </View>

        {/* Ingredient Selection */}
        <View className="mx-4">
          <IngredientSelector selectedIngredients={selectedIngredients} setSelectedIngredients={setSelectedIngredients} />
        </View>

        {/* Recipes */}
        <View>
          {meals.map((meal) => (
            <TouchableOpacity
              key={meal.idMeal}
              onPress={() =>
                navigation.navigate('RecipeDetail', {
                  idMeal: meal.idMeal,
                  strMealThumb: meal.strMealThumb,
                  // Add other properties you need here
                })
              }
            >
              <Image source={{ uri: meal.strMealThumb }} style={{ width: 100, height: 100 }} />
              <Text>{meal.strMeal}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

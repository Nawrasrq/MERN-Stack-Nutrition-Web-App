import React, { useState, useEffect } from 'react';

function DailyNutritionalInfo(props)
{
    const [totalNutrtionInfo, setTotalNutritionInfo] = new useState({});

    var foods = props.foods;

    function calculateTotals()
    {
        // Initialize totals to empty values
        let totalCalories, totalProtein, totalCarbs, totalFat, totalFiber, totalSugar, totalSodium, totalCholesterol;
        totalCalories = totalProtein = totalCarbs = totalFat = totalFiber = totalSugar = totalSodium = totalCholesterol = 0;

        // Loops through all the tracked foods and sum up their totals
        for (let i = 0; i < foods.length; i++)
        {
            let currentFood = foods[i];
            let qty = currentFood.Quantity;

            totalCalories += currentFood.Calories * qty;
            totalProtein += currentFood.Protein * qty;
            totalCarbs += currentFood.Carbs * qty;
            totalFat += currentFood.Fat * qty;
            totalFiber += currentFood.Fiber * qty;
            totalSugar += currentFood.Sugar * qty;
            totalSodium += currentFood.Sodium * qty;
            totalCholesterol += currentFood.Cholesterol * qty;
        }

        // Round values to display nicely
        totalCalories = Math.round(totalCalories);
        totalSodium = Math.round(totalSodium);
        totalCholesterol = Math.round(totalCholesterol);
        if (totalCarbs < 10)
            totalCarbs = Math.round(totalCarbs * 10) / 10;
        else
            totalCarbs = Math.round(totalCarbs);
        if (totalFat < 10)
            totalFat = Math.round(totalFat * 10) / 10;
        else
            totalFat = Math.round(totalFat);
        if (totalFiber < 10)
            totalFiber = Math.round(totalFiber * 10) / 10;
        else
            totalFiber = Math.round(totalFiber);
        if (totalProtein < 10)
            totalProtein = Math.round(totalProtein * 10) / 10;
        else
            totalProtein = Math.round(totalProtein);
        if (totalSugar < 10)
            totalSugar = Math.round(totalSugar * 10) / 10;
        else
            totalSugar = Math.round(totalSugar);

        let totalsSet = {
            TotalCalories:totalCalories,
            TotalProtein:totalProtein,
            TotalCarbs:totalCarbs,
            TotalFat:totalFat,
            TotalFiber:totalFiber,
            TotalSugar:totalSugar,
            TotalSodium:totalSodium,
            TotalCholesterol:totalCholesterol
        }

        setTotalNutritionInfo(totalsSet);
    }


    // Calculate nutritional info totals for this date
    useEffect(() => {
        calculateTotals();
    }, []);

    // Diplays total nutritional info for all of today's foods
    return(
        <div>
            <span>Daily Nutrtitional Intake:</span><br/>
            <span>  Calories: {totalNutrtionInfo.TotalCalories}</span><br/>
            <span>  Protein: {totalNutrtionInfo.TotalProtein}g</span><br/>
            <span>  Carbohydrates: {totalNutrtionInfo.TotalCarbs}g</span><br/>
            <span>  Fat: {totalNutrtionInfo.TotalFat}g</span><br/>
            <span>  Fiber: {totalNutrtionInfo.TotalFiber}g</span><br/>
            <span>  Sugar: {totalNutrtionInfo.TotalSugar}g</span><br/>
            <span>  Sodium: {totalNutrtionInfo.TotalSodium}mg</span><br/>
            <span>  Cholesterol: {totalNutrtionInfo.TotalCholesterol}mg</span><br/>
        </div>
    );
};
export default DailyNutritionalInfo;
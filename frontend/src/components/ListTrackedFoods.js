import React from 'react';

function ListTrackedFoods(props)
{
    // Simply just displays all the foods retrieved in a nice list format
    return(
        <div>
            <ul>
                {props.foods.map(food => (
                    <li key={food._id}>
                        <span>{food.Name}</span>
                        <span> | Qty: {food.Quantity}</span>
                        <span> | Calories: {food.Calories}</span><br/>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ListTrackedFoods;
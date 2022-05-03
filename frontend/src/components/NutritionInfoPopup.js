import React from 'react';
import { Button, Card, Container, Form, ListGroup, Row } from 'react-bootstrap';
import '../css/NutritionInfoPopup.css';

export default class NutritionInfoPopup extends React.Component {
    render() {
      if (!this.props.show) {
        return null;
      }

      var food = this.props.food;
      var name, calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol;
      var servingLabel, showServing;

      // Get all the nutritional values from the selected food
      name = food.Name;
      calories = food.Calories;
      protein = food.Protein;
      carbs = food.Carbs;
      fat = food.Fat;
      fiber = food.Fiber;
      sugar = food.Sugar;
      sodium = food.Sodium;
      cholesterol = food.Cholesterol;

      // Round nutrition values
      calories = Math.round(calories);
      sodium = Math.round(sodium);
      cholesterol = Math.round(cholesterol);
      if (carbs < 10)
          carbs = Math.round(carbs * 10) / 10;
      else
          carbs = Math.round(carbs);
      if (fat < 10)
          fat = Math.round(fat * 10) / 10;
      else
          fat = Math.round(fat);
      if (fiber < 10)
          fiber = Math.round(fiber * 10) / 10;
      else
          fiber = Math.round(fiber);
      if (protein < 10)
          protein = Math.round(protein * 10) / 10;
      else
          protein = Math.round(protein);
      if (sugar < 10)
          sugar = Math.round(sugar * 10) / 10;
      else
          sugar = Math.round(sugar);

      // Only given specified serving label from foods in external database
      if (food.ServingLabel)
      {
        servingLabel = "Serving Size: " + food.ServingLabel;
        showServing = true;
      }
      else
      {
        servingLabel = "";
        showServing = false;
      }

      var center = {
        width: '40%',
        height: '50%',
        top: '50%',
        left: '20%',
        padding: '20px',
        transform: 'translate(-50%, -50%)',
      }

      return (
        <div >
            <Container id='nutritionInfoPopup'>
                <Card id='innerNutritionInfoPopup' className='m-auto' bg='dark' style={center}>
                    <ListGroup style={{height: '95%', overflowY: 'scroll'}}>
                        <ListGroup.Item active variant='dark' style={{width: '95%'}} className='m-auto'>{name}</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} hidden={!showServing} className='m-auto'>{servingLabel}</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Calories: {calories}kcal</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Protein: {protein}g</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Carbohydrates: {carbs}g</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Fat: {fat}g</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Fiber: {fiber}g</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Sugar: {sugar}g</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Sodium: {sodium}mg</ListGroup.Item>
                        <ListGroup.Item variant='dark' style={{width: '95%'}} className='m-auto'>Cholesterol: {cholesterol}mg</ListGroup.Item>
                    </ListGroup>
                    <Button className='m-auto' variant='success' id="closeNutritionInfoPopupButton" onClick={this.props.closePopup}> Close </Button>
                </Card>
            </Container>
        </div>
      );
    }
  }
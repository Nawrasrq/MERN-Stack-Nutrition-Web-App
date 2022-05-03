import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../css/DailyCharts.css';

import 'chart.js/auto';
import {Pie, Doughnut} from 'react-chartjs-2';

function GoalsDisplay(props) 
{
    // Initialize fields required for object, get user data, and create message variable
    var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
	var lastName = ud.lastName;

    const [goals, setGoals] = new useState(null);
    const [totalNutrtionInfo, setTotalNutritionInfo] = new useState(null);
    const [pieData, setPieData] = new useState(null);

    const data = {
        labels: ["Protein", "Carbohydrates", "Fat"],
        datasets: [
            {
                label: 'Macronutrients',
                data: pieData,
                borderColor: ['rgba(255,206,86,0.2)'],
                backgroundColor: ['#9DB4AB', '#94A187', '#BBDB9B'],
                pointBackgroundColor: 'rgba(255,206,86,0.2)',
            }
            
        ]
    }

    const options = {
        plugins: {
            datalabels: {
                backgroundColor: function(context) {
                  return context.dataset.backgroundColor;
                },
                formatter: (val, context) =>
                  `${
                              Math.round((Number(val) * 100) /
                              context.chart.data.datasets[context.datasetIndex].data.reduce(
                                (a, b) => Number(a) + Number(b),
                                0
                              ))
                            }%`,
                //formatter: (val, context) => `${val}%`,
                borderRadius: 25,
                borderWidth: 3,
                color: "#35394a",
                font: {
                  weight: "bold"
                },
                padding: 6
            },
            title: {
                display: true,
                text: 'Macro Breakdown',
                color:'white',
                font: {
                    size:30,
                    weight:'normal'
                },
                padding:{
                    top:0,
                    bottom:30
                },
                responsive:true,
                animation:{
                    animateScale: true,
                }
            },
            legend: {
                fontColor:"white"
            },
            tooltip: {
                callbacks: {
                  label: (ttItem) =>
                    `${ttItem.label}: ${
                                Math.round((ttItem.parsed * 100) /
                                ttItem.dataset.data.reduce(
                                  (a, b) => Number(a) + Number(b),
                                  0
                                ))
                              }%`
                }
            }
        }
    }
    

    async function getData()
    {
        try
        { 
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/retrievegoal/' + userId),{method:'GET', headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error )
            {
                console.log(res.error);
            }
            else
            {
                setGoals(res.goal);
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }

    function calculateTotals()
    {
        // Initialize totals to empty values
        let totalCalories, totalProtein, totalCarbs, totalFat, totalFiber, totalSugar, totalSodium, totalCholesterol;
        totalCalories = totalProtein = totalCarbs = totalFat = totalFiber = totalSugar = totalSodium = totalCholesterol = 0;

        let foods = props.foods;

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

        let pieData = [totalProtein * 4, totalCarbs * 4, totalFat * 9];

        setPieData(pieData)

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

    useEffect(() => {
        getData();
        calculateTotals();
    }, []);


    var style =
    {
        padding: '20px', 
        display: 'flex', 
        'textAlign':'center', 
        'justifyContent':'center', 
        'alignItems':'center'
    }

  return (
    <div> 
        <Row>
            <Col style={{width: '100vh'}}>
                <Container style={{height:'70vh', width:'70vh', marginBottom:'5%'}} >
                    <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
                </Container>
            </Col>
            <Col style={{width: '100vh'}}>
                <Container style={{height:'80%', width:'100%', marginBottom:'5%'}}>
                    <span style={{fontSize:'30px'}}>Progress toward Daily Goals</span>
                    {goals !== null && totalNutrtionInfo !== null &&
                        <div style={{position:'relative', top:'50%', transform:'translateY(-50%)'}}>
                        <Col>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Calories: {totalNutrtionInfo.TotalCalories}/{goals.Calories} kcal</span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalCalories / goals.Calories * 100)} label={`${Math.round(totalNutrtionInfo.TotalCalories / goals.Calories * 100)}%`} /></div>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Protein: {totalNutrtionInfo.TotalProtein}/{goals.Protein}g </span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalProtein / goals.Protein * 100)} label={`${Math.round(totalNutrtionInfo.TotalProtein / goals.Protein * 100)}%`} /></div>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Carbs: {totalNutrtionInfo.TotalCarbs}/{goals.Carbs}g </span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalCarbs / goals.Carbs * 100)} label={`${Math.round(totalNutrtionInfo.TotalCarbs / goals.Carbs * 100)}%`} /></div>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Fat: {totalNutrtionInfo.TotalFat}/{goals.Fat}g </span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalFat / goals.Fat * 100)} label={`${Math.round(totalNutrtionInfo.TotalFat / goals.Fat * 100)}%`} /></div>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Fiber: {totalNutrtionInfo.TotalFiber}/{goals.Fiber}g </span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalFiber / goals.Fiber * 100)} label={`${Math.round(totalNutrtionInfo.TotalFiber / goals.Fiber * 100)}%`} /></div>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Sugar: {totalNutrtionInfo.TotalSugar}/{goals.Sugar} g </span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalSugar / goals.Sugar * 100)} label={`${Math.round(totalNutrtionInfo.TotalSugar / goals.Sugar * 100)}%`} /></div>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Sodium: {totalNutrtionInfo.TotalSodium}/{goals.Sodium} mg </span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalSodium / goals.Sodium * 100)} label={`${Math.round(totalNutrtionInfo.TotalSodium / goals.Sodium * 100)}%`} /></div>
                            <div style={{marginBottom:'4%', display:'flex', alignItems:'center'}}><span style={{width:'27%', float:'left', textAlign:'right', marginRight:'1vh'}}>Cholesterol: {totalNutrtionInfo.TotalCholesterol}/{goals.Cholesterol} mg </span><ProgressBar style={{height:'3vh', width:'73%', float:'right'}} animated='true' now={Math.round(totalNutrtionInfo.TotalCholesterol / goals.Cholesterol * 100)} label={`${Math.round(totalNutrtionInfo.TotalCholesterol / goals.Cholesterol * 100)}%`} /></div>
                        </Col>
                        </div>
                    }
                </Container>
            </Col>
        </Row> 
    </div>
  );
};
export default GoalsDisplay;

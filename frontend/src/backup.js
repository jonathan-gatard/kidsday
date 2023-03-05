import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";
import moment from 'moment';
import Chart from 'chart.js/auto';

const API_URL = "http://127.0.0.1:4000/api/";

function Form() {
    //Définir les props
    const [uid, setUid] = useState("");
    const [kids, setKids] = useState("");
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState("");
    const [showChart, setShowChart] = useState(false);
    const [statistiques, setStatistiques] = useState([]);
    const chartRef = useRef(null);


    //Vérifier si UID n'existe pas
    const uidExists = (uid) => {
        return axios
            .get(API_URL + "read", { params: { uid: uid } })
            .then((response) => {
                const existingData = response.data;
                return existingData.some((data) => data.uid === uid);
            })
            .catch((error) => {
                setMessage("Erreur lors de la récupération des données : " + error.message);
                setTypeMessage("error");
                return false;
            });
    };

    //Lors du clic
    const handleSubmit = (event) => {
        event.preventDefault();
        uidExists(uid).then((uidExists) => {
            if (uidExists) {
                setMessage("Cet UID existe déjà dans la base de données.");
                setTypeMessage("error");
            } else {
                axios
                    .post(API_URL + "write", { uid: uid, kids: kids })
                    .then((response) => {
                        setMessage("UID " + uid + " added with " + kids + " kids !");
                        setTypeMessage("good");
                        setUid("");
                        setKids("");
                        refreshData();
                    })
                    .catch((error) => {
                        setMessage("Error lors de l'envoi des données : " + error.message);
                        setTypeMessage("error");
                    });
            }
        });
    };

    //Rafraichir data
    const refreshData = () => {
        axios
            .get(API_URL + "read")
            .then((response) => {
                setStatistiques(response.data);
            })
            .catch((error) => {
                setMessage("Erreur lors de la récupération des données : " + error.message);
                setTypeMessage("error");
            });
    };

    //Supprimer une donnée
    const handleDelete = (id) => {
        axios.delete(API_URL + "delete/" + id)
            .then(response => {
                setMessage("Supprimé !");
                setTypeMessage("good");
                refreshData();
            })
            .catch(error => {
                console.log(error);
                setMessage("Error deleting data");
                setTypeMessage("error");
            });
    };

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [message]);

    useEffect(() => {
        if (showChart) {
            const dataKids = statistiques.reduce((acc, curr) => {
                const hour = moment(curr.updatedAt).hour();
                acc[hour] = (acc[hour] || 0) + curr.kids;
                return acc;
            }, {});

            const dataUID = statistiques.reduce((acc, curr) => {
                const hour = moment(curr.updatedAt).hour();
                if (acc[hour]) {
                    acc[hour]++;
                } else {
                    acc[hour] = 1;
                }
                return acc;
            }, {});

            const chart = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: Object.keys(dataKids),
                    datasets: [
                        {
                            label: 'Kids by hour',
                            data: Object.values(dataKids),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'UID by hour',
                            data: Object.values(dataUID),
                            backgroundColor: 'rgba(235, 54, 54, 0.2)',
                            borderColor: 'rgba(235, 54, 54, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            return () => chart.destroy();
        }
    }, [showChart, statistiques]);

    const totalKids = statistiques.reduce((acc, current) => {
        return acc + current.kids;
    }, 0);


    return (

        <div>
            {message && (
                <div className={`alertmessage ${typeMessage}`}>
                    <p>{message}</p>
                </div>
            )}

            <div className="formulaire">
                <h1>Kids day !</h1>
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="uid">UID :</label>
                        <input type="text" id="uid" name="uid" required maxLength="8" value={uid} onChange={(event) => setUid(event.target.value)} />
                        <label htmlFor="kids">Kids :</label>
                        <input type="number" id="kids" name="kids" required value={kids} onChange={(event) => setKids(event.target.value)} />
                        <button type="submit">Validate</button>
                    </form>
                    <button className="btnShowChart" onClick={() => { setShowChart(!showChart) }}>Show Chart</button>
                </div>

                <div className="statistiques">
                    <p>Numbers of UID : {statistiques.length}</p>
                    <p>Sum of kids : {totalKids}</p>
                </div>
                {showChart && (
                    <div className="chart">
                        <canvas ref={chartRef} />
                    </div>
                )}
                <div className="historique">
                    <table>
                        <tbody>
                            {statistiques
                                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                .map((statistiques) => (
                                    <tr key={statistiques._id}>
                                        <td>{statistiques.uid}</td>
                                        <td>{statistiques.kids}</td>
                                        <td>
                                            {moment(statistiques.updatedAt).format("DD/MM/YYYY - HH[:]mm[:]ss")}
                                        </td>
                                        <td><span className="redcross" onClick={() => handleDelete(statistiques._id)}>X</span></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}

export default App;

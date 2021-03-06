import React, {useEffect, useState} from 'react';
import {bindActionCreators, compose} from "redux";
import {withRouter} from "react-router-dom";
import './SearchIngredient.scss'
import get from "lodash/get";
import set from "lodash/set";
import { getAllCocktails } from "../../actions/CocktailDataAction";
import { getAllIngredient } from "../../actions/CocktailDataAction";
import { getModalIngredient } from "../../actions/CocktailDataAction";
import {connect} from "react-redux";
//TABS
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import DialogIngredient from "../../components/DialogIngredient/DialogIngredient";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));



const SearchIngredient = (props) => {
    const {
        handleGetAllCocktail,
        handleGetAllingredient,
        handleGetModalingredient,
        allCocktail,
        allIngredient,
    } = props
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [objIngredients, setObjIngredients] = useState({});
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        allIngredient.splice(0,allIngredient.length);
    };

    useEffect(() => {
        handleGetAllCocktail();
        handleGetAllingredient();
    }, []);

    useEffect(() => {
        let allDrink = [];
        let allIngredient = [];
        let allIngredientDrink = [];
        allCocktail.forEach((index) => {
            if (index.data.drinks !== null) {
                allDrink = index.data.drinks;
            }
            allDrink.forEach((ingr) => {
                allIngredient.push(ingr.strIngredient1, ingr.strIngredient2, ingr.strIngredient3, ingr.strIngredient4, ingr.strIngredient5, ingr.strIngredient6, ingr.strIngredient7, ingr.strIngredient8, ingr.strIngredient9, ingr.strIngredient10, ingr.strIngredient11, ingr.strIngredient12, ingr.strIngredient13, ingr.strIngredient14, ingr.strIngredient15);
            })
        })
        allIngredient.map((item) => {
            if (item !== null && item !== '') {
                allIngredientDrink.push(item.toLowerCase())
            }
        })
        const uniqueArray = [...new Set(allIngredientDrink.sort())];
        const obj = {};
        uniqueArray.forEach((indexArray) => {
          if (!get(obj, indexArray.charAt(0), null)) {
            obj[indexArray.charAt(0)] = [indexArray];
          } else {
            obj[indexArray.charAt(0)].push([indexArray]);
          }
        })
        setObjIngredients(obj);
    }, [allCocktail, handleGetAllingredient]);

    const clickIngredient = (e) =>{
        const data = {
            e,
        };
        handleGetAllingredient(data);
    }

    const modalClick = (e) => {
        const data = {
            e
        };
        handleGetModalingredient(data);
        setOpen(true);
    }

    return (
        <div className={`main-all main-page`}>
            <div className={`full-page`}>
                <div className={"back-ingredients"}></div>
            </div>
            <h1 className={"title-pages"}>Search your coctkail by Ingredient</h1>
            <div className={`classes.root full-width-mobile`}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example">
                        {
                          Object.keys(objIngredients).map((key, i) => (
                            <Tab key={i.toString()} label={key} {...a11yProps(i)} />
                          ))
                        }
                    </Tabs>
                </AppBar>
                {
                  Object.keys(objIngredients).map((key, i) => (
                      <TabPanel key={i.toString()} value={value} index={i}>
                          <ul className={'list-ingredients'}>
                              {
                                  objIngredients[key].map((item, i) => (
                                      <li className={"link-ingredient"} key={i.toString()} onClick={(e) => clickIngredient(item)}>{item}</li>
                                  ))
                              }
                          </ul>
                      </TabPanel>

                  ))
                }
            </div>
            <div className={`gallery-letter-flex`}>
                {
                    (allIngredient) ?(
                        allIngredient.map((item, i) => {
                            return <div className="card" key={i.toString()} onClick={(e) => modalClick(item.strDrink, item)}>
                                <img src={item.strDrinkThumb} alt="Avatar"/>
                                <div>
                                    <h4><b>{item.strDrink}</b></h4>
                                </div>

                            </div>
                        })
                    ):(
                        <div></div>
                    )
                }
            </div>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <DialogIngredient></DialogIngredient>
            </Modal>
        </div>
    )
}

const mapStateToProps = (state) => ({
    allCocktail: get(state, 'CoctkailData.allData', []),
    allIngredient: get(state, 'CoctkailData.allIngredient', []),
});

const mapDispatchToProps = (dispatch) => ({
    handleGetAllingredient: bindActionCreators(getAllIngredient, dispatch),
    handleGetModalingredient: bindActionCreators(getModalIngredient, dispatch),
    handleGetAllCocktail: bindActionCreators(getAllCocktails, dispatch),

});

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(SearchIngredient);

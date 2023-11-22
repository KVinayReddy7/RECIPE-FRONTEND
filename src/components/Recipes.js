import React, { useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import  Modal  from "react-bootstrap/Modal";
import  Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/esm/FormGroup";
import logo from "../logo2.png"
import "../styles/style.css";
export default function Recipes(){
    const [search, setSearch] = useState();
    const [searchRecipe, setSearchRecipe] = useState();
    const [recipes, setRecipes] = useState();
    const [role, setRole] = useState(false);
    const [oneRecipe, setOneRecipe] = useState({
      recipeName:"",
      description:"",
      image:"",
      ingredients:[]
    });
    const [show, setShow] = useState(false);
    const [showView, setShowView] = useState(false);
    const [viewRecipe, setViewRecipe] = useState();
    const [fullscreen, setFullscreen] = useState(true);
    //add recipe
    const [recipeName, setRecipeName] = useState();
    const [description, setDescription] = useState();
    const [image, setImage] = useState();
    const [ingredients, setIngredients] = useState();
    const [showAddRecipe, setShowAddRecipe] = useState(false);
   
    const navigate = useNavigate();
    const userdetails = JSON.parse(localStorage.getItem("user-info"));
    const recipesPage = () => {
      navigate("/")
    }
    //logout
    const logout = () => {
        localStorage.removeItem("user-info");
        navigate("/login");
        // setIsLoggedin(false);
    };
    function addrecipe()
    {
      setShowAddRecipe(true)
    }
    function searchItem(e) {
      setSearch(e.target.value);
        axios.get(
            `http://localhost:5500/recipe/search/${search}`,
            {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userdetails.data.token}`
                }
            })
            .then((response) => {
                // console.log(response.data.data)
                setSearchRecipe(response.data.data)
                

            })
            .catch(err => console.log(err));
    };
    useEffect(() => {
        if (!userdetails) {
            navigate("/login");
        }
        else{
            if(userdetails.data.data.role === "admin"){
                setRole(true);
            }
             axios.get("http://localhost:5500/recipe/getrecipe",
            {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userdetails.data.token}`
                }
            })
            .then((recipeObj)=>{
                return setRecipes(recipeObj.data)
            })
            .catch((err)=>{
                console.log("error",err)
            })
        }
    })
    const deleteRecipe = ((id) => {
        axios.delete(`http://localhost:5500/recipe/deleteRecipe/${id}`,{
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${userdetails.data.token}`
            }
        })
        .then((response) => {
            // console.log(response)
            alert("Recipe deleted successfully")
        })
        .catch(err => console.log(err));
    })

    //update Recipe Id
    const updateRecipeId = async (id) => {
      await axios.get(`http://localhost:5500/recipe/${id}`,
      {
        headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userdetails.data.token}`
        }
      }).then(response=>{
        // console.log("oneRecipe",response.data)
        // setUpdateId(id);
        setOneRecipe(response.data[0]);
        // var image = new Image();
        //  image.src =response.data[0].image;
        //  var i=document.body.appendChild(image);
        console.log("image",response.data[0].image);
        setShow(true)
      }).catch(error => {
          alert("Recipe fetch is failed");
          console.error("error:", error);
      })
    };
    // console.log("onerecipe",oneRecipe);
    const handleClose = () => {
      setOneRecipe(); 
      setShow(false);
    };
    const handleViewClose = () => setShowView(false);
    const handleAddClose = () =>{
      setOneRecipe(); 
      setShowAddRecipe(false)
    };

    // base64 to image
  //   function dataURLtoFile(dataurl, filename) {
  //     var arr = dataurl.split(','),
  //         mime = arr[0].match(/:(.*?);/)[1],
  //         bstr = atob(arr[arr.length - 1]), 
  //         n = bstr.length, 
  //         u8arr = new Uint8Array(n);
  //     while(n--){
  //         u8arr[n] = bstr.charCodeAt(n);
  //     }
  //     return new File([u8arr], filename, {type:mime});
  // }
  
  // //Usage example:
  // var file = dataURLtoFile('data:text/plain;base64,aGVsbG8=','hello.txt');
  // console.log(file);

    //update recipe
    const handleUpdateRecipe = async () => {
        var ingredient = await oneRecipe.ingredients
        console.log("ingredient",ingredient);
        var ingre = await ingredient.replace(/,/g, ',');
        ingre = await ingre.split(",");
          await axios.put(`http://localhost:5500/recipe/update/${oneRecipe._id}`, 
          { 
            "recipeName":oneRecipe.recipeName, 
            "description": oneRecipe.description, 
            "image": oneRecipe.image,
            "ingredients": ingre
          }, 
          {
            headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userdetails.data.token}`
            }
          }).then(response=>{
            // console.log("1",response)
            alert("Recipe Updated Successfully");
            setOneRecipe();
            setShow(false);
            navigate("/");
            
        }).catch(error => {
            alert("Recipe adding is failed");
            //  console.error("error:", error);
        })
      };
      //image
      const convertToBase64 = async (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };
      const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        // console.log(base64);
         setOneRecipe({...oneRecipe, image:base64});
      }; 
      //view
      const ViewRecipeId = ((id) => {
        axios.get(`http://localhost:5500/recipe/${id}`,{
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${userdetails.data.token}`
            }
        })
        .then((response) => {
            console.log("view Recipe: ",response.data[0])
            setViewRecipe(response.data[0]);
            setShowView(true);
            // alert("Recipe deleted successfully");

        })
        .catch(err => console.log(err));
    })
    //add recipe
    const handleAddRecipe = async (event) => {
      event.preventDefault();
      var rawIngredient = oneRecipe.ingredients;
      var ingre = rawIngredient.replace(/,/g, ',');
       ingre = ingre.split(",");
      console.log("OneRecipe:", oneRecipe.recipeName);
      console.log("Ingredient: ",ingre);
        await axios.post("http://localhost:5500/recipe/addRecipe", 
        { 
          "recipeName":oneRecipe.recipeName, 
            "description": oneRecipe.description, 
            "image": oneRecipe.image,
            "ingredients": ingre
        }, 
        {
          headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userdetails.data.token}`
          }
        }).then(response=>{
          // console.log("1",response)
          alert("Recipe Added Successful");  
          setOneRecipe();        
          setShowAddRecipe(false)
          navigate("/");
          

      }).catch(error => {
          alert("Recipe adding is failed");
          // console.error("error:", error);
      })
    };
    return (
        <>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bgGreen">
                  <div className="container">
                    {/* <h className="navbar-brand">Navbar w/ text</h> */}
                    <img src={logo} className="navbar-brand" alt="logo" style={{"height":150}}/>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon">
                        <img src={logo} onClick={recipesPage} className="App-logo" alt="logo" />
                      </span>
                    </button>
                    <div className="collapse navbar-collapse text-center" id="navbarText" style={{"justifyContent":"center"}}>
                        <ul className="navbar-nav  mb-2 mb-lg-0">
                          <li className="nav-item m-2">
                            <input  type="text" className="form-control nav-search" 
                            placeholder="Search..." 
                            // onChange={(e) => setSearch(e.target.value)}
                            onChange={searchItem}
                            /> 
                          </li>
                          <li className="nav-item m-2">
                            <button onClick={searchItem} className="btn btn-warning" type="submit">
                              <FontAwesomeIcon icon={faSearch} />
                            </button>
                          </li>
                        </ul>
                    </div>
                    <div>
                        <button className="btn borderColor logout" onClick={logout}>Logout</button>
                      </div>
                    </div>
                </nav>
            </div>
            
            <div className="container">
            <div className="row">
            {role ? <div className="text-end p-3"> <button className="btn borderColor" onClick={addrecipe}><b>Add Recipe</b></button> </div> : null}
                {searchRecipe ? searchRecipe.map((recipe, index) => (
                  <div className="col-3 card" style={{margin: "2.5rem"}} >
                        <div className="card-body">
                        <img src={recipe.image} className="card-img-top" alt="..." />
                          <h5 className="text-uppercase textColor">{recipe.recipeName}</h5>
                          {/* <p style={{textAlign:"right"}} className="card-text">{recipe.description}</p>
                         {recipe.ingredients?.map((ing)=>( <p style={{textAlign:"right"}} className="card-text">{ing}</p>))} */}
                          {role ? <button  className='btn borderColor'onClick={() =>{deleteRecipe(recipe._id)}}>Delete</button> : null}
                          {role ? <button className='btn borderColor m-1'onClick={() =>{updateRecipeId(recipe._id)}}>Update</button> : null}
                           <button className='btn borderColor 'onClick={() =>{ViewRecipeId(recipe._id)}}>View</button>
                        </div>
                  </div>
                ))
                :
                recipes?.map((data, index)=> (
                  <div className="col-3 card" style={{margin: "2.5rem"}} >  
                  <div className="card shadow">               
                    <div className="card-body">
                      <img src={data.image} className="card-img-top" alt="..." />
                      <h5 className="text-uppercase textColor">{data.recipeName}</h5>
                      {role ? <button className='btn borderColor delete'onClick={() =>{deleteRecipe(data._id)}}>Delete</button> : null }
                      {role ? <button className='btn borderColor update m-1'onClick={() =>{updateRecipeId(data._id)}}>Update</button> : null}
                      <button className='btn borderColor view'onClick={() =>{ViewRecipeId(data._id)}}>View</button>
                    </div>
                    </div>
                  </div>
                ))}
                
                </div>
            </div>

            {/* Update popup */}
            {oneRecipe ? <Modal show={show} className="modal-lg"  onHide={handleClose}>
                <Modal.Header closeButton className="popupBgColor">
                  <Modal.Title>Update Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateRecipe}>
                        <Form.Group className="mb-3" >
                          <Form.Label className="fs-bold textColor" >
                            Recipe-Name
                          </Form.Label>
                          <Form.Control
                          type="text"
                          name="recipeName"
                          value={oneRecipe.recipeName}
                          onChange={(e) => setOneRecipe({...oneRecipe, recipeName: e.target.value})}
                          required />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                          <Form.Label className="fs-bold textColor" >
                            Description
                          </Form.Label>
                          <Form.Control
                           as="textarea" rows={3}
                          name="description"
                          value={oneRecipe.description}
                          onChange={(e) => setOneRecipe({...oneRecipe, description:e.target.value})}
                          required />
                        </Form.Group>
                        <Form.Group className="mb-3" >                          
                          <Form.Control
                          type="file"
                          name="image"
                          // value={oneRecipe.image}
                          onChange={handleFileUpload}
                          required />
                          {/* <Form.Label className="fs-bold textColor" >
                            Upload Image 
                          </Form.Label> */}
                          
                          {/* <label class="label">
                            <input type="file" name="image" onChange={handleFileUpload} required/>
                            <span>Selected file</span>
                          </label> */}
                          <img src={oneRecipe.image} alt="img"/>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                          <Form.Label className="fs-bold textColor" >
                          Ingredient Name
                          </Form.Label>
                          <Form.Control
                          type="text"
                          name="ingredients"
                          value={oneRecipe.ingredients}
                          onChange={(e) => setOneRecipe({...oneRecipe, ingredients:e.target.value})}
                          required />
                        </Form.Group>
                        <FormGroup className="text-center">
                          <button
                            className="btn borderColor"
                            type="submit"
                          >Submit</button>
                        </FormGroup>
                    </Form>
                </Modal.Body>
            </Modal> : null}

           {/* view */}
           <Modal show={showView} fullscreen={fullscreen} onHide={handleViewClose}>
                <Modal.Header closeButton className="popupBgColor">
                  <Modal.Title className="">Recipe Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-5">
                          <img src={viewRecipe?.image} style={{width: 500}} alt="img"/>  
                        </div>
                        <div className="col-7">
                          <div className="bgGreen text-light mb-5 rounded text-center">
                            <label className="fs-1"><b>Recipe Name: </b></label>
                            <span className="fs-1 text-uppercase textColor fst-italic"><b> {viewRecipe?.recipeName}</b></span>
                          </div>
                          <div className="text-light mb-5 rounded">
                            <h3 className="textColor">Ingredients</h3>
                            <ul>
                              {viewRecipe?.ingredients?.map((ing, index)=> (<li key={index}>{ing}</li>))}
                            </ul>
                          </div>
                          <div className="text-light rounded">
                            <h3 className="textColor">Description</h3>
                            <p>{viewRecipe?.description}</p>
                            </div>
                        </div>
                        </div>                        
                </Modal.Body>
            </Modal>

            {/* Add Recipe */}
          <Modal show={showAddRecipe} className="modal-lg" onHide={handleAddClose}>
            <Modal.Header className="popupBgColor" closeButton>
              <Modal.Title>Add Recipe</Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddRecipe}>
              <Form.Group className="mb-3" >
                <Form.Label className="fs-bold textColor" >
                  Recipe-Name
                </Form.Label>
                <Form.Control
                type="text"
                name="recipeName"
                // value={}
                onChange={(e) => setOneRecipe({...oneRecipe, recipeName: e.target.value})}
                required />
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label className="fs-bold textColor" >
                  Description
                </Form.Label>
                <Form.Control
                as="textarea" rows={3}
                name="description"                
                onChange={(e) => setOneRecipe({...oneRecipe, description: e.target.value})}
                required />
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label className="fs-bold textColor" >
                Upload Image 
                </Form.Label>
                <label class="label">
                  <input type="file" name="image" onChange={handleFileUpload} required/>
                  <span>Selected file</span>
                </label>
                {/* <Form.Control
                type="file"
                name="image"
                // value={}
                
                required /> */}
                {oneRecipe? <img src={oneRecipe?.image}  alt="img" />: null}
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label className="fs-bold textColor" >
                Ingredient Name
                </Form.Label>
                <Form.Control
                type="text"
                name="ingredients"
                // value={}
                onChange={(e) => setOneRecipe({...oneRecipe, ingredients: e.target.value})}
                required />
              </Form.Group>
              <FormGroup className="text-center">
                <button
                  className="btn borderColor"                
                  type="submit"
                >Submit</button>
              </FormGroup>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    )
}
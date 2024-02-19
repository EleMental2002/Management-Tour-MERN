import React, { useEffect, useState, useContext } from "react";
import {
  Progress,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { storage } from "../utils/firebase";
import { uuidv4 } from "@firebase/util";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { BASE_URL } from "./../utils/config";

import { AdminAuthContext } from "./../context/adminAuthContext";

const App = () => {
  const {
    admin
  } = useContext(AdminAuthContext);


  const [image, setImage] = useState(null);
  const [imglist, setImgList] = useState([]);
  const [progress, setProgress] = useState(0);

  const userPath = `admins/${admin._id}/hotels/`;
  const imageListRef = ref(storage, userPath);

  const [credentials, setCredentials] = useState({
    title: " ",
    city: " ",
    address: " ",
    distance: " ",
    desc: " ",
    price: " ",
    maxGroupSize: " ",
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // Check if there is at least one image uploaded
      if (imglist.length > 0) {
        // Extracting only the URLs from the imglist array
        const imageUrls = imglist.map((img) => img.url);

        const res = await fetch(`${BASE_URL}/tours/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...credentials,
            photo: imageUrls,
          }),
          credentials: "include",
        });

        const result = await res.json();
        // console.log(result);

        if (result.success) {
          // Handle success
        }
      } else {
        // Handle the case where no image is uploaded
        alert("Please upload at least one image");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const uploadFile = async () => {
    try {
      if (imglist.length >= 3 || image === null) {
        alert("You can upload a maximum of 3 images.");
        return;
      }
      const imageRef = ref(storage, `${userPath}${image.name + uuidv4()}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Handle errors
          console.error("Error uploading image:", error);
          alert("Error uploading image. Please try again.");
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);

            alert("File uploaded Successfully");
            setProgress(0);
            setImage(null);
          } catch (error) {
            console.error("Error getting download URL:", error);
            alert("Error getting download URL. Please try again.");
          }
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const deleteHandle = (ref, url) => {
    deleteObject(ref).then(() => {
      setImgList(imglist.filter((img) => img.url !== url));
      alert("Successfully deleted");
    });
  };
  const resetCredentials = () => {
    const resetValues = Object.fromEntries(
      Object.keys(credentials).map((key) => [key, " "]) // or " "
    );
    setCredentials(resetValues);
  };
  const handleCancel = async (e) => {
    try {
      alert("Are you sure you want to cancel the upload?");
      // Reset input fields to null
      resetCredentials();
      // Check if there are images to delete
      if (imglist.length > 0) {
        const deletePromises = imglist.map((fileobj) =>
          deleteObject(fileobj.ref).catch((error) => {
            console.error("Error deleting image:", error);
            throw error; // Rethrow the error to be caught later
          })
        );
        // Wait for all delete promises to resolve
        await Promise.all(deletePromises);
        // Clear the imglist after successful deletion
        setImgList([]);
        alert("Successfully deleted all images");
      } else {
        alert("No images to delete");
      }
    } catch (error) {
      alert("Error deleting images. Please try again.");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {

        const res = await listAll(imageListRef);
        const promises = res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { url, ref: item };
        });

        const files = await Promise.all(promises);
        setImgList(files);
        // console.log("Image List:", files);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [imageListRef, image]);

  return (
    <Container>
      <Row>
        {admin ? (
          <Form onSubmit={handleClick}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <FormGroup>
                <Label for="img-upload">Add an image (max: 3)</Label>
                <Input
                  type="file"
                  className="form-control"
                  id="img-upload"
                  accept="image/*"
                  onChange={(event) => {
                    setImage(event.target.files[0]);
                  }}
                />
              </FormGroup>
              <Button className="btn btn-success" onClick={uploadFile}>
                Upload
              </Button>
            </div>

            {progress !== 0 ? (
              <div className="my-2">
                <Progress animated value={progress}>
                  {`${progress}%`}
                </Progress>
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                maxWidth: "800px",
                margin: "auto",
              }}
            >
              {imglist &&
                imglist.map((fileobj, index) => (
                  <div key={index} className="card my-3 w-25">
                    <img className="" src={fileobj.url} alt="" />
                    <Button
                      className="btn btn-danger"
                      onClick={() => deleteHandle(fileobj.ref, fileobj.url)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
            </div>
            <Label for="title">Title</Label>
            <FormGroup>
              <input
                type="text"
                placeholder="Hotel Name"
                required
                id="title"
                value={credentials.title}
                onChange={handleChange}
              />
            </FormGroup>
            <Label for="city">City</Label>
            <FormGroup>
              <input
                type="text"
                placeholder=""
                required
                id="city"
                value={credentials.city}
                onChange={handleChange}
              />
            </FormGroup>
            <Label for="address">Location</Label>
            <FormGroup>
              <input
                type="text"
                placeholder=""
                required
                id="address"
                value={credentials.address}
                onChange={handleChange}
              />
            </FormGroup>
            <Label for="distance">Distance</Label>
            <FormGroup>
              <input
                type="number"
                placeholder=""
                required
                id="distance"
                value={credentials.distance}
                onChange={handleChange}
              />
            </FormGroup>
            <Label for="desc">Description</Label>
            <FormGroup>
              <input
                type="text"
                placeholder=""
                required
                id="desc"
                value={credentials.desc}
                onChange={handleChange}
              />
            </FormGroup>
            <Label for="price">Price</Label>
            <FormGroup>
              <input
                type="number"
                placeholder=""
                required
                id="price"
                value={credentials.price}
                onChange={handleChange}
              />
            </FormGroup>
            <Label for="maxGroupSize">MaxGroupSize</Label>
            <FormGroup>
              <input
                type="number"
                placeholder=""
                required
                id="maxGroupSize"
                value={credentials.maxGroupSize}
                onChange={handleChange}
              />
            </FormGroup>
            <Button className="btn secondary__btn auth__btn" type="submit">
              Save
            </Button>
          </Form>
        ) : null}
        <div style={{ marginTop: "10px" }}>
          <Button
            className="btn secondary__btn auth__btn"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </Row>
    </Container>
  );
};

export default App;
import { useContext, useRef, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ShopContext } from "../Context/ShopContext";
import ImageCropper from "../Components/ImageCropper";
import { toast, ToastContainer } from "react-toastify";

const Post = () => {
  const [image, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState("choose-img");
  const [imgAfterCrop, setImgAfterCrop] = useState("");
  const [uniqueFilename, setUniqueFilename] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "electronics",
    price: "",
    userId: "",
  });

  const inputRef = useRef();
  const { listItems, authToken } = useContext(ShopContext);

  const dataURLtoBlob = (dataurl) => {
    if (!dataurl) {
      console.error("Invalid dataurl:", dataurl);
      return null;
    }

    const arr = dataurl.split(",");
    if (arr.length < 2) {
      console.error("Invalid dataurl:", dataurl);
      return null;
    }

    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      console.error("Invalid MIME type:", arr[0]);
      return null;
    }
    const mime = mimeMatch[1];

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const onImageSelected = (selectedImg) => {
    setImage(selectedImg);
    setCurrentPage("crop-img");
  };

  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = () => {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");
      setImgAfterCrop(dataURL);
      setCurrentPage("choose-img");
    };
  };

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        onImageSelected(reader.result);
      };
    }
  };

  const onChooseImg = () => {
    inputRef.current.click();
  };

  const onCropCancel = () => {
    setCurrentPage("choose-img");
    setImage("");
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateUniqueFilename = () => {
    const date = new Date().toISOString();
    const uuid =
      date +
      "-" +
      "xxx-xx-4xx-yxx-xxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    return uuid;
  };

  useEffect(() => {
    const uploadCroppedImage = async () => {
      if (!imgAfterCrop) return;

      const uniqueFilename = `${generateUniqueFilename()}.jpeg`;
      setUniqueFilename(uniqueFilename);
      const uploadUrl = `https://l00pe1iha9.execute-api.us-east-1.amazonaws.com/TEST/snt-images-storage/${uniqueFilename}`;

      const imageBlob = dataURLtoBlob(imgAfterCrop);

      try {
        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: imageBlob,
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        if (!response.ok) throw new Error("Upload failed");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    uploadCroppedImage();
  }, [imgAfterCrop]);

  const postItem = async () => {
    const { name, description, category, price } = formData;
    const image = uniqueFilename ? `https://snt-images-storage.s3.amazonaws.com/${uniqueFilename}` : "";

    if (!name || !description || !category || !price) {
      toast.error("All fields must be filled out.");
      return;
    }

    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast.error("Login required");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    const payload = JSON.stringify({ name, description, category, price, userId, image });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/postitem", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        toast.success("Item posted successfully");
        setFormData({
          name: "",
          description: "",
          category: "electronics",
          price: "",
          userId: "",
        });
        setUniqueFilename("");
        setImgAfterCrop("");
        setImage("");
        setCurrentPage("choose-img");

        listItems();
      } else {
        console.error("Post item error:", responseData.error);
      }
    } catch (error) {
      console.error("Post item error:", error);
    }
  };

  if (!authToken) {
    return (
      <div className="bg-white h-[70vh] flex justify-center">
        <h1 className="text-2xl font-medium text-gray-900 mt-36">Please log in to post items.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-[77vh]">
      <ToastContainer />
      <div className="bg-white p-4 py-8">
        {currentPage === "choose-img" ? (
          <>
            <div className="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white">New Post</div>
            <div className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
              <input
                className="bg-gray-100 border border-gray-300 p-2 mb-4 outline-none focus:ring-0 focus:border-2 focus:border-green-700"
                value={formData.name}
                onChange={changeHandler}
                type="text"
                name="name"
                placeholder="Name"
              />
              <input
                className="bg-gray-100 border border-gray-300 p-2 mb-4 outline-none focus:ring-0 focus:border-2 focus:border-green-700"
                value={formData.price}
                onChange={changeHandler}
                type="number"
                name="price"
                placeholder="Price"
                step="0.01"
              />
              <select
                value={formData.category}
                onChange={changeHandler}
                name="category"
                className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none focus:ring-0 focus:border-2 focus:border-green-700"
              >
                <option value="electronics">Electronics</option>
                <option value="vehicles">Vehicles</option>
                <option value="furnitures">Furnitures</option>
                <option value="books">Books</option>
                <option value="tickets">Tickets</option>
                <option value="clothing">Clothing</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
              <textarea
                className="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none focus:ring-0 focus:border-2 focus:border-green-700"
                value={formData.description}
                onChange={changeHandler}
                type="text"
                name="description"
                placeholder="Describe everything about this post here"
              ></textarea>

              <div className="icons flex text-gray-500 m-2">
                <label id="select-image">
                  <button onClick={onChooseImg}>
                    {imgAfterCrop ? (
                      <svg
                        className="mr-2 cursor-pointer hover:text-green-800 border rounded-full p-1 h-7 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    )}
                  </button>
                  <input style={{ display: "none" }} onChange={handleOnChange} ref={inputRef} accept="image/*" type="file" />
                </label>
              </div>
              <div id="preview" className="my-4 flex"></div>
              <div className="buttons flex justify-end">
                <div className="rounded-md p-1 px-4 font-semibold cursor-pointer text-white ml-2 bg-green-700 hover:bg-green-800" onClick={postItem}>
                  Post
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <ImageCropper onCropDone={onCropDone} onCropCancel={onCropCancel} image={image} />
          </>
        )}
      </div>
    </div>
  );
};

export default Post;

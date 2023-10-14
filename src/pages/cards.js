import React, { useCallback, useRef } from "react";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Spinner from "react-bootstrap/Spinner";
import "./cards.scss";
import AddToCartButton from "../components/button";

function Cards() {
  const [products, setProducts] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [page, setPage] = useState(1);
  const [sortingOption, setSortingOption] = useState("Сортиране");
  const [selectedCategories, setSelectedCategories] = useState(
    "Филтиране по категория"
  );
  const [filterButton, setFilteredButton] = useState(false);

  let fetchData = () => {
    if (isLoading2) return;

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = `https://greet.bg/wp-json/wc/store/products?page=${page}`;
    setIsLoading2(true);

    fetch(proxyUrl + targetUrl)
      .then((response) => {
        return response.json();
      })
      .then((info) => {
        setProducts([...products, ...info]);
        const allCategories = info.flatMap((product) => product.categories);
        const uniqueCategoriesNew = [
          ...new Set(allCategories.map((category) => category.name)),
        ];
        const categoriesSet = [
          ...new Set([...uniqueCategories, ...uniqueCategoriesNew]),
        ];
        setUniqueCategories(categoriesSet);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
        setPage((prevPage) => prevPage + 1);
        setIsLoading2(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight + 1 >= scrollHeight - 20 && !isLoading2) {
        fetchData();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading2]);

  useEffect(() => {
    setFilteredInfo(products);
  }, [products]);

  const handleAscending = () => {
    const numAscending = [...products].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredInfo(numAscending);
    setSortingOption("Азбучен ред а-я");
    setFilteredButton(true);
  };
  const handleDescending = () => {
    const numAscending = [...products].sort((b, a) =>
      a.name.localeCompare(b.name)
    );
    setFilteredInfo(numAscending);
    setSortingOption("Азбучен ред я-а");
    setFilteredButton(true);
  };
  const handleVoteAscending = () => {
    const numAscending = [...products].sort((a, b) => {
      const voteA = parseFloat(a.prices.price);
      const voteB = parseFloat(b.prices.price);
      return voteA - voteB;
    });
    setFilteredInfo(numAscending);
    setSortingOption(" Цена увеличаваща");
    setFilteredButton(true);
  };

  const handleVoteDescending = () => {
    const numAscending = [...products].sort((a, b) => {
      const voteA = parseFloat(a.prices.price);
      const voteB = parseFloat(b.prices.price);
      return voteB - voteA;
    });
    setFilteredInfo(numAscending);
    setSortingOption("Цена намаляваща");
    setFilteredButton(true);
  };
  const handleCategorySelect = (category) => {
    const filteredProducts = category
      ? products.filter((product) =>
          product.categories.some((cat) => cat.name === category)
        )
      : products;
    setFilteredInfo(filteredProducts);
  };

  const handleCategory = (category) => {
    setSelectedCategories(category);
    setFilteredButton(true);
  };

  const clearFilter = () => {
    setFilteredInfo(products);
    setSortingOption("Сортиране");
    setSelectedCategories("Филтриране по категория");
    setFilteredButton(false);
  };

  return (
    <div className="backGroundContainer">
      <div>
        <img
          className="logo"
          alt="logo"
          src="https://greet.bg/wp-content/uploads/2020/07/greetbg-300x115.png"
        />
      </div>
      <div>
        <p className="additionalInfo">
          Свържи се с любими артисти, творци и инфлуенсъри и създай незабравими
          емоции за теб и приятели.
        </p>
      </div>
      <div className="filtersContainer">
        <DropdownButton
          id="customButton"
          onSelect={handleCategorySelect}
          title={selectedCategories}
        >
          {uniqueCategories.map((category, index) => (
            <Dropdown.Item
              className="dropDownItem"
              key={index}
              eventKey={category}
              onClick={() => handleCategory(category)}
            >
              {category}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton title={sortingOption} id="customButton2">
          <Dropdown.Item onClick={handleAscending} className="dropDownItem">
            Азбучен ред а-я
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDescending} className="dropDownItem">
            Азбучен ред я-а
          </Dropdown.Item>
          <Dropdown.Item onClick={handleVoteAscending} className="dropDownItem">
            Цена увеличаваща
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleVoteDescending}
            className="dropDownItem"
          >
            Цена намаляваща
          </Dropdown.Item>
        </DropdownButton>
        {filterButton ? (
          <Button id="customButton3" onClick={() => clearFilter()}>
            Изичистване на филтрите
          </Button>
        ) : null}
      </div>
      <div className="cards">
        {isLoading ? (
          <Spinner animation="border" role="status">
            <p className="visually-hidden">Loading...</p>
          </Spinner>
        ) : filteredInfo ? (
          filteredInfo.map((item) => (
            <Card className=" everyCard">
              <Card.Img
                variant="top"
                className="cardImage"
                src={item.images[0].src}
                alt={item.alt}
              />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  {item.short_description.substring(
                    3,
                    item.short_description.length - 4
                  )}
                </Card.Text>
                <Card.Text>
                  {item.categories.map((info) => (
                    <p key={info.id}> {info.name} </p>
                  ))}
                </Card.Text>
                <Card.Text>
                  {item.prices.price.substring(0, item.prices.price.length - 2)}
                  лв
                </Card.Text>
                <AddToCartButton itemId={item.id} />
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
      <div>
        {isLoading2 ? (
          <Spinner animation="border" role="status">
            <p className="visually-hidden">Loading...</p>
          </Spinner>
        ) : null}{" "}
      </div>
    </div>
  );
}
export default Cards;

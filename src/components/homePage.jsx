import React, { useEffect, useState } from "react";
import { setHeadlines, appendHeadlines } from "../redux/headlinesSlice";
import { setIsLoading } from "../redux/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { getHeadlines } from "../utils/apiService";
import LoadingPage from "./loadingPage";
import NewsCard from "./newsCard";
import "./../static/css/homePage.css";

const PAGE_LIMIT = 5;

const HomePage = () => {
  const { headlines } = useSelector((state) => state.headlines);
  const { loading } = useSelector((state) => state.loading);
  const { loginOpen, createUserOpen } = useSelector((state) => state.form);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [scrollPos, setScrollPos] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        dispatch(setIsLoading(true));
        const response = await getHeadlines(null, null, page, PAGE_LIMIT);
        setTotalPages(response.pageInfo.totalPages);

        if (page === 1) {
          dispatch(setHeadlines(response.headlines));
        } else {
          dispatch(appendHeadlines(response.headlines));
        }

        setScrollPos(window.scrollY);
        dispatch(setIsLoading(false));
      } catch (error) {
        console.error(error);
      }
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        console.log(totalPages);
        if (page + 1 <= totalPages) {
          setPage(page + 1);
        }
      }
    };
    fetchHeadlines();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, dispatch]);

  useEffect(() => {
    window.scrollTo(0, scrollPos);
  }, [scrollPos]);

  return (
    <div
      className="homepage-container"
      style={{
        zIndex: (loginOpen || createUserOpen) ? -1 : 100,
      }}
    >
      {headlines &&
        headlines.map((item) => {
          return <NewsCard item={item} key={item._id} />;
        })}
      {loading && <LoadingPage />}
    </div>
  );
};

export default HomePage;

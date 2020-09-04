import React, { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [searchString, setSearchString] = useState('');
  const [moviesList, setList] = useState([]);
  const [nominatedMoviesList, setNominatedMoviesList] = useState([]);
  const [requestError, setRequestError] = useState('');

  const handleChange = (event) => {
    setSearchString(event.target.value);

    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=ebe8ad7e&s=${event.target.value}&type=movie`)
    .then(res => res.json())
    .then(
      (result) => {
        if (result.Search) {
          setList(result.Search);
          setRequestError('');
        }

        if (result.Error) {
          setList([]);

          switch (result.Error) {
            case 'Too many results.':
              setRequestError('Too many results. Please, add one or more letters.');
              break;
            case 'Movie not found!':
              setRequestError('Movie not found. Please, insert another search term.');
              break;
            default:
              setRequestError('Service unavailable. Please, try again later.');
          }
        }
      }
    )
  }

  const updateNominatedMoviesList = (movie) => setNominatedMoviesList(nominatedMoviesList => [...nominatedMoviesList, movie]);

  const removeNominatedMovie = (movie) => setNominatedMoviesList(nominatedMoviesList.filter(item => item.imdbID !== movie.imdbID));

  const shouldDisableButton = (movie) => {
    let result = false;

    if (nominatedMoviesList.includes(movie) || nominatedMoviesList.length === 5) result = true;

    return result;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>The Shoppies</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Welcome to The Shoppies! Choose your favorite movies and nominate them." key="meta-description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>The Shoppies</h1>

        <div className={styles.full_size_grid}>
          <div className={styles.card}>
            <form>
              <label className={styles.label}>Movie title</label>
              <div className={styles.input_container}>
                <input type="text" name="movie" className={styles.input} onChange={handleChange} />
                <img className={styles.input_img} src="/search.png" id="search_img"></img>
              </div>
              {
                requestError !== '' && (
                  <p className={styles.error_message}>{requestError}</p>
                )
              }
            </form>
          </div>
        </div>

        <div className={styles.half_size_grid_with_padding}>
          <div className={styles.card}>
              <h2>Results for "{searchString}"</h2>
              {
                moviesList.length > 0 ? (
                  <ul className={styles.list}>
                    {
                      moviesList.map((movie, index) =>
                        <li key={index} className={styles.list_item}>
                          <p className={styles.movie_name}>{movie.Title} ({movie.Year})</p>
                          <button className={styles.button} disabled={shouldDisableButton(movie)} type="button" onClick={() => updateNominatedMoviesList(movie)}>Nominate</button>
                        </li>
                      )
                    }
                  </ul>
                ) :
                (
                  <p>No results</p>
                )
              }
          </div>
        </div>

        <div className={styles.half_size_grid}>
          <div className={styles.card}>
              <h2>Nominations</h2>
              {
                nominatedMoviesList.length > 0 ? (
                  <ul className={styles.list}>
                    {
                      nominatedMoviesList.map((movie, index) =>
                        <li key={index} className={styles.list_item}>
                          <p className={styles.movie_name}>{movie.Title} ({movie.Year})</p>
                          <button className={styles.button} type="button" onClick={() => removeNominatedMovie(movie)}>Remove</button>
                        </li>
                      )
                    }
                  </ul>
                ) :
                (
                  <p>No nominations</p>
                )
              }
              {
                nominatedMoviesList.length === 5 && (
                  <div className={styles.banner_success}>
                    <p>Congrats! All nominations were made.</p>
                  </div>
                )
              }
          </div>
        </div>
      </main>
    </div>
  )
}

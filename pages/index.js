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
          setRequestError(result.Error);
        }
      }
    )
  }

  const updateNominatedMoviesList = (movie) => setNominatedMoviesList(nominatedMoviesList => [...nominatedMoviesList, movie]);

  const removeNominatedMovie = (movie) => setNominatedMoviesList(nominatedMoviesList.filter(item => item.imdbID !== movie.imdbID));

  const test = (movie) => {
    if (nominatedMoviesList.includes(movie) || nominatedMoviesList.length === 5) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>The Shoppies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>The Shoppies</h1>

        <div className={styles.full_size_grid}>
          <div className={styles.card}>
            <form>
              <label className={styles.label}>Movie title</label>
              <input type="text" name="movie" className={styles.input} onChange={handleChange} />
              {
                requestError != '' && (
                  <p>Error: {requestError}</p>
                )
              }
            </form>
          </div>
        </div>

        <div className={styles.half_size_grid}>
          <div className={styles.card}>
              <h2>Results for "{searchString}"</h2>
              {
                moviesList.length > 0 ? (
                  moviesList.map((movie, index) =>
                    <ul>
                      <li key={index} className={styles.list_item}>{movie.Title} ({movie.Year}) <button disabled={test(movie)} type="button" onClick={() => updateNominatedMoviesList(movie)}>Nominate</button></li>
                    </ul>
                  )
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
                  nominatedMoviesList.map(movie =>
                    <ul>
                      <li key={movie.imdbID} className={styles.list_item}>{movie.Title} ({movie.Year}) <button type="button" onClick={() => removeNominatedMovie(movie)}>Remove</button></li>
                    </ul>
                  )
                ) :
                (
                  <p>No nominations</p>
                )
              }
              {
                nominatedMoviesList.length === 5 && (
                  <p>Congrats! All nominations were made.</p>
                )
              }
          </div>
        </div>
      </main>
    </div>
  )
}

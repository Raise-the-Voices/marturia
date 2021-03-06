import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

import MainLayout from '../components/MainLayout';
import { convertMonthtoStringFormat } from '../utils/utils';
import './Victims.scss';
import data from '../data/countries.json';

const Victims = (props) => {
  const [victimList, setVictimList] = useState(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [country, setCountry] = useState('');
  const [statuses, setStatuses] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE;

  const constructQStr = (name, country, status) => {
    return `?report-state=published&sort=created_at desc&victim-name=${
      name || ''
    }&country=${country || 'all'}&status=${status || 'all'}`;
  };

  const fetchOptions = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}options`);
      const filteredOptions = data['options-list'].filter(
        (option) => option.group === 'current_status'
      );
      setStatuses(filteredOptions);
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const fetchVictimsOnLoad = async () => {
    try {
      const query = queryString.parse(props.location.search);
      setCountry(query.country || '');
      setStatus(query.status || '');
      setName(query['victim-name'] || '');
      const qstr = constructQStr(
        query['victim-name'],
        query.country,
        query.status
      );
      await fetchVictims(qstr);
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const fetchVictims = async (qstr) => {
    try {
      const { data } = await axios.get(`${apiUrl}victims${qstr}`);
      const victimList = data.victim.map((victim) => {
        return {
          id: victim.ID,
          name: victim.name,
          status: victim.current_status,
          location: victim.country,
          dob: convertMonthtoStringFormat(victim.date_of_birth),
          url: victim.profile_image_url,
        };
      });
      setVictimList(victimList);
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const handleSubmit = async () => {
    const qstr = constructQStr(name, country, status);
    await fetchVictims(qstr);
  };

  useEffect(() => {
    fetchOptions();
    fetchVictimsOnLoad();
  }, []);

  return (
    <MainLayout>
      <div className='victims page'>
        <div className='wrapper'>
          <div className='searchSelect'>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className='search'
                placeholder='Search by name...'
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </form>
            <div className='selectSubmit'>
              <select
                id='status'
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option key={'sel'} value='all'>
                  Select Status
                </option>
                {statuses?.map((item) => (
                  <option key={item.title} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </select>
              <select
                id='countries'
                onChange={(e) => setCountry(e.target.value)}
                value={country}
              >
                <option key={'all'} value='all'>
                  Select Country
                </option>
                {data.countries.map((item) => (
                  <option key={item.country} value={item.country}>
                    {item.country}
                  </option>
                ))}
              </select>
              <button type='submit' className='btn' onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
          <ul className='list'>
            {victimList && victimList.length !== 0 ? (
              victimList.map((item, index) => (
                <li key={item.id}>
                  <div className='col'>
                    {item.url ? (
                      <img className='photo' src={item.url} alt='victim' />
                    ) : (
                      'No photo available'
                    )}
                  </div>
                  <div className='col'>
                    <div className='name'>
                      <span>Name:</span> {item.name}
                    </div>
                    <div className='dob'>
                      <span>Date of Birth:</span> {item.dob}
                    </div>
                    <div className='location'>
                      <span>Location: </span> {item.location}
                    </div>
                    <div className='status'>
                      <span>Status: </span> {item.status}
                    </div>
                    <div className='more-btn'>
                      <Link to={'/view/' + String(item.id)}> MORE </Link>
                    </div>
                  </div>
                </li>
              ))
            ) : victimList === null ? (
              <p> loading... </p>
            ) : (
              <p> No victims matching search parameters found </p>
            )}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default Victims;

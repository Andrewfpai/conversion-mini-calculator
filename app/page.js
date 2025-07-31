'use client';

import { useEffect, useState, useRef } from 'react';

const formatter = new Intl.NumberFormat('en-US');

export default function ExchangeRate() {
  const [rates, setRates] = useState(null);

  const [customRpPerRmb, setCustomRpPerRmb] = useState(null); // start null
  const [customRmbAmount, setCustomRmbAmount] = useState(1);
  const [customRpAmount, setCustomRpAmount] = useState(0);
  const [status, setStatus] = useState(true);

  const lastChangedRef = useRef('rmb');

  const [customRpPerRmb2, setCustomRpPerRmb2] = useState(null); // start null
  const [customRmbAmount2, setCustomRmbAmount2] = useState(1);
  const [customRpAmount2, setCustomRpAmount2] = useState(0);

  const lastChangedRef2 = useRef('rmb');

  useEffect(() => {
    fetch('/api/coingecko')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => setRates(data))
      .catch(err => console.error("Failed to fetch exchange rate:", err));
  }, []);

  // Set initial B from API rate once
  useEffect(() => {
    if (rates) {
      const usdtToIdr = rates?.tether?.idr;
      const usdtToRmb = rates?.tether?.cny;
      const rmbToIdr = usdtToIdr / usdtToRmb;

      if (customRpPerRmb === null) {
        setCustomRpPerRmb(Number(rmbToIdr.toFixed(2)));
        setCustomRpAmount(Number(rmbToIdr.toFixed(2)) * customRmbAmount);
        setCustomRpPerRmb2(Number(rmbToIdr.toFixed(2)));
        setCustomRpAmount2(Number(rmbToIdr.toFixed(2)) * customRmbAmount2);
      }
    }
  }, [rates, customRpPerRmb, customRmbAmount]);

  if (!rates || customRpPerRmb === null) return <p>Loading...</p>;

  const usdtToIdr = rates?.tether?.idr;
  const usdtToRmb = rates?.tether?.cny;
  const rmbToIdr = usdtToIdr / usdtToRmb;

  function handleRpPerRmbChange(e) {
    const val = Number(e.target.value.replace(/,/g, ''));
    if (val <= 0 || isNaN(val)) return;
    setCustomRpPerRmb(val);
    if (lastChangedRef.current === 'rmb') {
      setCustomRpAmount(customRmbAmount * val);
    } else {
      setCustomRmbAmount(customRpAmount / val);
    }
  }
  function handleRpPerRmbChange2(e) {
    const val = Number(e.target.value.replace(/,/g, ''));
    if (val <= 0 || isNaN(val)) return;
    setCustomRpPerRmb2(val);
    if (lastChangedRef2.current === 'rmb') {
      setCustomRpAmount2(customRmbAmount2 * val);
    } else {
      setCustomRmbAmount2(customRpAmount2 / val);
    }
  }

  function handleCustomRmbChange(e) {
    let val = e.target.value.replace(/,/g, '');

    if (val === '') {
      setCustomRmbAmount('');
      setCustomRpAmount(0);
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(val)) return;

    const num = Number(val);
    if (isNaN(num) || num < 0) return;

    lastChangedRef.current = 'rmb';
    setCustomRmbAmount(num);
    setCustomRpAmount(num * customRpPerRmb);
  }

  function handleCustomRmbChange2(e) {
    let val = e.target.value.replace(/,/g, '');

    if (val === '') {
      setCustomRmbAmount2('');
      setCustomRpAmount2(0);
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(val)) return;

    const num = Number(val);
    if (isNaN(num) || num < 0) return;

    lastChangedRef.current = 'rmb';
    setCustomRmbAmount2(num);
    setCustomRpAmount2(num * customRpPerRmb2);
  }

  function handleCustomRpChange(e) {
    const val = Number(e.target.value.replace(/,/g, ''));
    if (val < 0 || isNaN(val)) return;
    lastChangedRef.current = 'rp';
    setCustomRpAmount(val);
    setCustomRmbAmount(val / customRpPerRmb);
  }

  function handleCustomRpChange2(e) {
    const val = Number(e.target.value.replace(/,/g, ''));
    if (val < 0 || isNaN(val)) return;
    lastChangedRef.current = 'rp';
    setCustomRpAmount2(val);
    setCustomRmbAmount2(val / customRpPerRmb2);
  }

  return (
    <div className="w-full h-full min-h-screen p-[4%] pt-[8%] md:pt-[4%] space-y-4 bg-gray-100 ">

      <div className='flex flex-col gap-5 '>
        <div className='flex mx-auto flex-row items-center gap-[50px] max-w-[90%] justify-center text-stone-700 font-bold'>
          <div className='flex flex-col items-center'>
            <span className='text-xs md:text-lg'>1 $</span>
            <span className='text-[#7e57c2] text-sm md:text-lg'>Rp{formatter.format(usdtToIdr)}</span>
          </div>

          <div className='flex flex-col items-center'>
            <span className='text-xs md:text-lg'>1 $</span>
            <span className='text-[#7e57c2] text-sm md:text-lg'>¥ {formatter.format(usdtToRmb)}</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='text-xs md:text-lg'>1 $</span>
            <span className='text-[#7e57c2] text-sm md:text-lg'>¥ {formatter.format(rmbToIdr.toFixed(2))}</span>
          </div>
      
        
      </div>

      <hr className='text-stone-300'/>

      <div className="flex flex-row px-[30%] md:px-56 md:max-w-[100%] max-w-[90%] mx-auto justify-center gap-[35%] bg-purple-100 py-7 rounded-lg">
        
        <div className='flex flex-col text-center items-center gap-[3px] '>
          <span className='flex font-bold text-stone-700'>RMB</span>
          <span className='flex items-center text-stone-700 gap-1 ' >
            <span className='text-[100%]'>¥</span>
            <span className='text-[150%] font-bold'>1</span>
          </span>
        </div>
        <div className='flex flex-col text-center items-center gap-1 '>
          <span className='flex font-bold text-stone-700'>RUPIAH</span>
          <span className='flex items-center text-[#7e57c2] gap-2'>
            <span className='text-[100%]'>Rp</span>
            <input
            type="text"
            value={formatter.format(customRpPerRmb)}
            onChange={handleRpPerRmbChange}
            className="min-w-4 max-w-28 text-center flex font-bold text-[150%]"
          />
          </span>
        </div>

        
      </div>

      <div className="flex flex-row px-[30%] md:px-48 md:max-w-[100%] max-w-[90%] mx-auto justify-center gap-[20%] bg-purple-100 py-7 rounded-lg">
        
        <div className='flex flex-col text-center items-center gap-[3px] '>
          <span className='flex font-bold text-stone-700'>RMB</span>
          <span className='flex items-center text-stone-700 gap-1' >
            <span className='text-[100%]'>¥</span>
            <input
          type="text"
          value={customRmbAmount === '' ? '' : formatter.format(customRmbAmount)}
          onChange={handleCustomRmbChange}
          className="max-w-20 text-center flex font-bold text-[150%]"
        />
          </span>
        </div>
        <div className='flex flex-col text-center items-center gap-1 '>
          <span className='flex font-bold text-stone-700'>RUPIAH</span>
          <span className='flex items-center text-[#7e57c2] gap-2'>
            <span className='text-[100%]'>Rp</span>
            <input
          type="text"
          value={formatter.format(customRpAmount)}
          onChange={handleCustomRpChange}
          className="max-w-30 text-center flex font-bold text-[150%]"
        />
          </span>
        </div>

        
      </div>
      
      {/* SECTION 2 */}
      <div className='flex mx-auto text-3xl w-12 h-12 text-stone-50 cursor-pointer bg-[#7e57c2] rounded-[25px] text-center' onClick={()=>{setStatus(!status)}}>
        <span className='flex items-center mx-auto'>{status?"+":"-"}</span>
      </div>
      
      
      <div className={status?"hidden":"flex gap-5 flex-col"}>
        <div className="flex flex-row px-[30%] md:px-56 md:max-w-[100%] max-w-[90%] mx-auto justify-center gap-[35%] bg-purple-100 py-7 rounded-lg">
        
        <div className='flex flex-col text-center items-center gap-[3px] '>
          <span className='flex font-bold text-stone-700'>RMB</span>
          <span className='flex items-center text-stone-700 gap-1 ' >
            <span className='text-[100%]'>¥</span>
            <span className='text-[150%] font-bold'>1</span>
          </span>
        </div>
        <div className='flex flex-col text-center items-center gap-1 '>
          <span className='flex font-bold text-stone-700'>RUPIAH</span>
          <span className='flex items-center text-[#7e57c2] gap-2'>
            <span className='text-[100%]'>Rp</span>
            <input
            type="text"
            value={formatter.format(customRpPerRmb2)}
            onChange={handleRpPerRmbChange2}
            className="min-w-4 max-w-28 text-center flex font-bold text-[150%]"
          />
          </span>
        </div>

        
      </div>

        <div className="flex flex-row px-[30%] md:px-48 md:max-w-[100%] max-w-[90%] mx-auto justify-center gap-[20%] bg-purple-100 py-7 rounded-lg">
          
          <div className='flex flex-col text-center items-center gap-[3px] '>
            <span className='flex font-bold text-stone-700'>RMB</span>
            <span className='flex items-center text-stone-700 gap-1' >
              <span className='text-[100%]'>¥</span>
              <input
            type="text"
            value={customRmbAmount2 === '' ? '' : formatter.format(customRmbAmount2)}
            onChange={handleCustomRmbChange2}
            className="max-w-20 text-center flex font-bold text-[150%]"
          />
            </span>
          </div>
          <div className='flex flex-col text-center items-center gap-1 '>
            <span className='flex font-bold text-stone-700'>RUPIAH</span>
            <span className='flex items-center text-[#7e57c2] gap-2'>
              <span className='text-[100%]'>Rp</span>
              <input
            type="text"
            value={formatter.format(customRpAmount2)}
            onChange={handleCustomRpChange2}
            className="max-w-30 text-center flex font-bold text-[150%]"
          />
            </span>
          </div>

          
        </div>
      </div>


      </div>

      
      


      
    </div>
  );
}

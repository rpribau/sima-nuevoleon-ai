'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { File } from 'lucide-react';
import { useState } from 'react';

// Section 1: Especiales - Titles for the cards
const especialesTitles = [
  "Evaluación de Partículas Suspendidas PM2.5 en el Área Metropolitana de Monterrey",
  "Estudio del Monitoreo Atmosférico en el Centro Comercial 'Pueblo Serena', Monterrey",
  "Estudio del Monitoreo Atmosférico en la Empresa 'Akra', San Pedro Garza García",
  "Estudio del Monitoreo Atmosférico en las Oficinas de Secretaría de Gobierno Municipal, San Pedro Garza García",
  "Meseta del parque ecológico 'Chipinque', San Pedro Garza García",
  "Municipio de García, N. L."
];

// Section 2: Mensuales - Years for the small navbar
const years = Array.from({ length: 15 }, (_, i) => 2010 + i);

const municipios = [
    "Abasolo", "Allende", "Anáhuac", "Cadereyta", "Cerralvo", "Ciénega de Flores",
    "Doctor González", "El Cármen", "García", "General Terán", "General Treviño", "Guadalupe",
    "Higueras", "Hualahuises", "Linares", "Los Aldama", "Los Herrera", "Los Ramones",
    "Melchor Ocampo", "Monterrey", "Pesquería", "Salinas Victoria", "San Pedro", "Santa Catarina"
  ];

// Section 3: URLs for each month of each year
const monthLinks: Record<number, Record<number, string>> = {
  2010: {
    0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/01_Reporte_Enero_2010.pdf',
    1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/02_Reporte_Febrero_2010.pdf',
    2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/03_Reporte_Marzo_2010.pdf',
    3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/04_Reporte_Abril_2010.pdf',
    4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/05_Reporte_Mayo_2010.pdf',
    5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/06_Reporte_Junio_2010.pdf',
    6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/07_Reporte_Julio_2010.pdf',
    7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/08_Reporte_Agosto_2010.pdf',
    8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/09_Reporte_Septiembre_2010.pdf',
    9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/10_Reporte_Octubre_2010.pdf',
    10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/11_Reporte_Noviembre_2010.pdf',
    11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2010/12_Reporte_Diciembre_2010.pdf',
  },
  2011: {
    0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/01_Reporte_Enero_2011.pdf',
    1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/02_Reporte_Febrero_2011.pdf',
    2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/03_Reporte_Marzo_2011.pdf',
    3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/04_Reporte_Abril_2011.pdf',
    4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/05_Reporte_Mayo_2011.pdf',
    5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/06_Reporte_Junio_2011.pdf',
    6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/07_Reporte_Julio_2011.pdf',
    7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/08_Reporte_Agosto_2011.pdf',
    8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/09_Reporte_Septiembre_2011.pdf',
    9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/10_Reporte_Octubre_2011.pdf',
    10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/11_Reporte_Noviembre_2011.pdf',
    11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2011/12_Reporte_Diciembre_2011.pdf',
  },
  2012: {
    0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/01_Reporte_Enero_2012.pdf',
    1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/02_Reporte_Febrero_2012.pdf',
    2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/03_Reporte_Marzo_2012.pdf',
    3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/04_Reporte_Abril_2012.pdf',
    4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/05_Reporte_Mayo_2012.pdf',
    5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/06_Reporte_Junio_2012.pdf',
    6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/07_Reporte_Julio_2012.pdf',
    7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/08_Reporte_Agosto_2012.pdf',
    8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/09_Reporte_Septiembre_2012.pdf',
    9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/10_Reporte_Octubre_2012.pdf',
    10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/11_Reporte_Noviembre_2012.pdf',
    11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2012/12_Reporte_Diciembre_2012.pdf',
  },
    2013: {
        0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/01_Reporte_Enero_2013.pdf',
        1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/02_Reporte_Febrero_2013.pdf',
        2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/03_Reporte_Marzo_2013.pdf',
        3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/04_Reporte_Abril_2013.pdf',
        4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/05_Reporte_Mayo_2013.pdf',
        5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/06_Reporte_Junio_2013.pdf',
        6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/07_Reporte_Julio_2013.pdf',
        7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/08_Reporte_Agosto_2013.pdf',
        8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/09_Reporte_Septiembre_2013.pdf',
        9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/10_Reporte_Octubre_2013.pdf',
        10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/11_Reporte_Noviembre_2013.pdf',
        11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2013/12_Reporte_Diciembre_2013.pdf',
    },
    2014: {
        0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/01_Reporte_Enero_2014.pdf',
        1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/02_Reporte_Febrero_2014.pdf',
        2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/03_Reporte_Marzo_2014.pdf',
        3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/04_Reporte_Abril_2014.pdf',
        4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/05_Reporte_Mayo_2014.pdf',
        5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/06_Reporte_Junio_2014.pdf',
        6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/07_Reporte_Julio_2014.pdf',
        7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/08_Reporte_Agosto_2014.pdf',
        8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/09_Reporte_Septiembre_2014.pdf',
        9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/10_Reporte_Octubre_2014.pdf',
        10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/11_Reporte_Noviembre_2014.pdf',
        11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2014/12_Reporte_Diciembre_2014.pdf',
    },
    2015: {
        0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/01_Reporte_Enero_2015.pdf',
        1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/02_Reporte_Febrero_2015.pdf',
        2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/03_Reporte_Marzo_2015.pdf',
        3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/04_Reporte_Abril_2015.pdf',
        4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/05_Reporte_Mayo_2015.pdf',
        5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/06_Reporte_Junio_2015.pdf',
        6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/07_Reporte_Julio_2015.pdf',
        7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/08_Reporte_Agosto_2015.pdf',
        8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/09_Reporte_Septiembre_2015.pdf',
        9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/10_Reporte_Octubre_2015.pdf',
        10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/11_Reporte_Noviembre_2015.pdf',
        11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2015/12_Reporte_Diciembre_2015.pdf',
    },
    2016: {
        0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/01_Reporte_Enero_2016.pdf',
        1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/02_Reporte_Febrero_2016.pdf',
        2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/03_Reporte_Marzo_2016.pdf',
        3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/04_Reporte_Abril_2016.pdf',
        4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/05_Reporte_Mayo_2016.pdf',
        5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/06_Reporte_Junio_2016.pdf',
        6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/07_Reporte_Julio_2016.pdf',
        7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/08_Reporte_Agosto_2016.pdf',
        8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/09_Reporte_Septiembre_2016.pdf',
        9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/10_Reporte_Octubre_2016.pdf',
        10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/11_Reporte_Noviembre_2016.pdf',
        11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2016/12_Reporte_Diciembre_2016.pdf',
    },
    2017: {
        0: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/01_Reporte_Enero_2017.pdf',
        1: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/02_Reporte_Febrero_2017.pdf',
        2: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/03_Reporte_Marzo_2017.pdf',
        3: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/04_Reporte_Abril_2017.pdf',
        4: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/05_Reporte_Mayo_2017.pdf',
        5: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/06_Reporte_Junio_2017.pdf',
        6: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/07_Reporte_Julio_2017.pdf',
        7: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/08_Reporte_Agosto_2017.pdf',
        8: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/09_Reporte_Septiembre_2017.pdf',
        9: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/10_Reporte_Octubre_2017.pdf',
        10: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/11_Reporte_Noviembre_2017.pdf',
        11: 'https://aire.nl.gob.mx/docs/reportes/mensuales/2017/12_Reporte_Diciembre_2017.pdf',
        
    },
    2018: {
        0: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/01_Reporte_Enero_2019.pdf',
        1: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/02_Reporte_Febrero_2019.pdf',
        2: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/03_Reporte_Marzo_2019.pdf',
        3: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/04_Reporte_Abril_2019.pdf',
        4: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/05_Reporte_Mayo_2019.pdf',
        5: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/06_Reporte_Junio_2019.pdf',
        6: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/07_Reporte_Julio_2019.pdf',
        7: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/08_Reporte_Agosto_2019.pdf',
        8: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/09_Reporte_Septiembre_2019.pdf',
        9: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/10_Reporte_Octubre_2019.pdf',
        10: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/11_Reporte_Noviembre_2019.pdf',
        11: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/12_Reporte_Diciembre_2019.pdf',
        
    },
    2019: {
        0: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/01_Reporte_Enero_2019.pdf',
        1: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/02_Reporte_Febrero_2019.pdf',
        2: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/03_Reporte_Marzo_2019.pdf',
        3: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/04_Reporte_Abril_2019.pdf',
        4: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/05_Reporte_Mayo_2019.pdf',
        5: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/06_Reporte_Junio_2019.pdf',
        6: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/07_Reporte_Julio_2019.pdf',
        7: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/08_Reporte_Agosto_2019.pdf',
        8: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/09_Reporte_Septiembre_2019.pdf',
        9: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/10_Reporte_Octubre_2019.pdf',
        10: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/11_Reporte_Noviembre_2019.pdf',
        11: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2019/12_Reporte_Diciembre_2019.pdf',
    },
    2020: {
        0: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/01_Reporte_Enero_2020.pdf',
        1: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/02_Reporte_Febrero_2020.pdf',
        2: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/03_Reporte_Marzo_2020.pdf',
        3: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/04_Reporte_Abril_2020.pdf',
        4: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/05_Reporte_Mayo_2020.pdf',
        5: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/06_Reporte_Junio_2020.pdf',
        6: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/07_Reporte_Julio_2020.pdf',
        7: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/08_Reporte_Agosto_2020.pdf',
        8: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/09_Reporte_Septiembre_2020.pdf',
        9: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/10_Reporte_Octubre_2020.pdf',
        10: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/11_Reporte_Noviembre_2020.pdf',
        11: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2020/12_Reporte_Diciembre_2020.pdf',

    },
    2021: {
        0: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/01_Reporte_Enero_2021.pdf',
        1: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/02_Reporte_Febrero_2021.pdf',
        2: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/03_Reporte_Marzo_2021.pdf',
        3: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/04_Reporte_Abril_2021.pdf',
        4: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/05_Reporte_Mayo_2021.pdf',
        5: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/06_Reporte_Junio_2021.pdf',
        6: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/07_Reporte_Julio_2021.pdf',
        7: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/08_Reporte_Agosto_2021.pdf',
        8: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/09_Reporte_Septiembre_2021.pdf',
        9: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/10_Reporte_Octubre_2021.pdf',
        10: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/11_Reporte_Noviembre_2021.pdf',
        11: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2021/12_Reporte_Diciembre_2021.pdf',

    },
    2022: {
        0: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/01_Reporte_Enero_2022.pdf',
        1: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/02_Reporte_Febrero_2022.pdf',
        2: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/03_Reporte_Marzo_2022.pdf',
        3: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/04_Reporte_Abril_2022.pdf',
        4: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/05_Reporte_Mayo_2022.pdf',
        5: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/06_Reporte_Junio_2022.pdf',
        6: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/07_Reporte_Julio_2022.pdf',
        7: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/08_Reporte_Agosto_2022.pdf',
        8: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/09_Reporte_Septiembre_2022.pdf',
        9: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/10_Reporte_Octubre_2022.pdf',
        10: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/11_Reporte_Noviembre_2022.pdf',
        11: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2022/12_Reporte_Diciembre_2022.pdf',
    },
    2023: {
        0: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/01_Reporte_Enero_2023.pdf',
        1: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/02_Reporte_Febrero_2023.pdf',
        2: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/03_Reporte_Marzo_2023.pdf',
        3: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/04_Reporte_Abril_2023.pdf',
        4: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/05_Reporte_Mayo_2023.pdf',
        5: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/06_Reporte_Junio_2023.pdf',
        6: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/07_Reporte_Julio_2023.pdf',
        7: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/08_Reporte_Agosto_2023.pdf',
        8: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/09_Reporte_Septiembre_2023.pdf',
        9: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/10_Reporte_Octubre_2023.pdf',
        10: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/11_Reporte_Noviembre_2023.pdf',
        11: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2023/12_Reporte_Diciembre_2023.pdf',
    },
    2024: {
        0: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/01_Reporte_Enero_2024.pdf',
        1: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/02_Reporte_Febrero_2024.pdf',
        2: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/03_Reporte_Marzo_2024.pdf',
        3: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/04_Reporte_Abril_2024.pdf',
        4: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/05_Reporte_Mayo_2024.pdf',
        5: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/06_Reporte_Junio_2024.pdf',
        6: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/07_Reporte_Julio_2024.pdf',
        7: 'http://aire.nl.gob.mx/docs/reportes/mensuales/2024/08_Reporte_Agosto_2024.pdf',
    },
};

export default function Informes() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [showEspeciales, setShowEspeciales] = useState(true);
  const [showMensuales, setShowMensuales] = useState(true);
  const [showMunicipales, setShowMunicipales] = useState(true);

  return (
    <div className="space-y-8 p-6 mx-auto max-w-6xl">

      {/* Section 1: Especiales */}
      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Especiales</h2>
          <button 
            onClick={() => setShowEspeciales(!showEspeciales)} 
            className="text-green-600"
          >
            {showEspeciales ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {showEspeciales && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {especialesTitles.map((title, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <File className="w-7 h-7" />
                    <span>{title}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Mensuales */}
      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mensuales</h2>
          <button 
            onClick={() => setShowMensuales(!showMensuales)} 
            className="text-green-600"
          >
            {showMensuales ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {showMensuales && (
          <>
            <div className="flex flex-wrap items-center justify-center space-x-1.5 mt-4">
              {years.map((year) => (
                <button
                  key={year}
                  className={`rounded-full px-4 py-2 transition-all ${selectedYear === year ? 'bg-green-600 text-white' : 'bg-gray-200'} mb-2`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {Array.from({ length: 12 }, (_, i) => (
                <Card 
                  key={i} 
                  onClick={() => window.open(monthLinks[selectedYear][i], '_blank')} 
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <File className="w-7 h-7" />
                      <span>
                        {new Date(0, i).toLocaleString('es-ES', { month: 'long' }).charAt(0).toUpperCase() + 
                        new Date(0, i).toLocaleString('es-ES', { month: 'long' }).slice(1)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Section 3: Municipales */}
      <section>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Municipales</h2>
          <button onClick={() => setShowMunicipales(!showMunicipales)} className="text-green-600">
            {showMunicipales ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {showMunicipales && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {municipios.map((municipio, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <File className="w-7 h-7" />
                    <span>{municipio}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

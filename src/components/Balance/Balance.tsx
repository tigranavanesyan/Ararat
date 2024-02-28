import { FC, useState, useEffect } from 'react'

import copy from 'copy-to-clipboard';
import { useNavigate } from "react-router-dom";
import { useAppSelector } from '../../hooks/redux';
import MainButton from '../UI/MainButton';
import Modal from '../UI/Modal';
import { useAppDispatch } from '../../hooks/redux';
import { setRequizits } from '../../store/reducers/UserSlice';
import { Disclosure } from '@headlessui/react'
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp'
import Abonements from '../../assets/abonements.png'
import Abonements2 from '../../assets/abonements2.png'
import { addUserToChat } from '../../store/reducers/MessengerSlice';

const Balance: FC = () => {
    const [info, setInfo] = useState<{ name: string, number: string, en: string, ru: string, bik: string }>({
        name: '',
        number: '',
        en: '',
        ru: '',
        bik: '',
    });
    const [modal, setModal] = useState<boolean>(false);
    const { user } = useAppSelector(state => state.UserSlice);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        console.log(user.requizits);
        if (user.requizits) {
            if (user.requizits === 1) {
                setInfo({ name: 'Перевод Сбербанк Россия', number: '5469 4000 3714 2192', en: 'Grigoryan Hrachya', ru: 'Григорян Грачья Гришаевич', bik: '044525225' });
            } else if (user.requizits === 2) {
                setInfo({ name: 'Перевод Тинькофф банк Россия', number: '2200 7007 7604 8364', en: 'Grigoryan Hrachya', ru: 'Григорян Грачья Гришаевич', bik: '044525974' });
            } else if (user.requizits === 3) {
                setInfo({ name: 'Перевод Сбербанк Россия', number: '2202 2063 4915 2509', en: 'Tamamyan Arevik', ru: 'Тамамян Аревик', bik: '044525225' });
            } else if (user.requizits === 4) {
                setInfo({ name: 'Перевод в евро ID bank Armenia (Visa card)', number: '4318 2900 8060 0022', en: 'Anahit Tadevosyan', ru: 'Анаит Тадевосян', bik: '11800158005909' });
            }
            else if (user.requizits === 5) {
                setInfo({ name: 'Перевод в евро ID bank Armenia (Visa card)', number: '4318 2900 8061 9683', en: 'Meline Khachatryan', ru: 'Мелине Хачатрян', bik: '11800353068001' });
            } else {
                setInfo({ name: 'Перевод Сбербанк Россия', number: '2202 2061 8058 3689', en: 'Ogannes Khachatryan', ru: 'Хачатрян Оганнес', bik: '044525225' });
            }
        } else {
            setModal(true);
        }

    }, [user.requizits])

    const setRequizitsHandler = async (type: string) => {
        await dispatch(setRequizits(type));
        setModal(false);
    }

    const [copyState, setCopyState] = useState({
        number: false,
        en: false,
        ru: false,
        bik: false
    });

    const handleChatAdmin = async () => {
        await dispatch(addUserToChat({ email: user.email, dialog_id: "65b86bdacb902d80a341938c" })).then((res) => {
            if (res.payload === undefined || res !== undefined ) {
                navigate("/messenger/chat/65b86bdacb902d80a341938c");
            }
        });
    }

    const [copy1, setCopy1] = useState<boolean>(false);
    const [copy2, setCopy2] = useState<boolean>(false);
    const [copy3, setCopy3] = useState<boolean>(false);
    const [copy4, setCopy4] = useState<boolean>(false);
    return (
        <div className='w-full flex flex-col items-center px-5 py-0 max-2xl:px-0 max-2xl:py-0 bg-[#f0f0f0] rounded-xl overflow-auto h-[calc(100vh-35px)]'>
            <a className='bg-gradient-button rounded-full px-10 py-3 mb-5 font-semibold text-2xl shadow-lg hover:bg-gradient-appricot' target='_blank' href="https://shakhmatnayashkolaararat.s20.online/customer/1/profile/index">Проверить счет и все списания в личном кабинете CRM системы</a>
            <div className="flex mb-5 max-2xl:mb-1">
                <ul className='text-center flex flex-col justify-center bg-white max-w-[520px] w-full mr-5'>
                    <li className='border-b px-10 py-2 font-bold text-red-400 text-2xl max-2xl:text-xl'>Постоянные скидки</li>
                    <li className='border-b px-10 py-2'>1. Оплата за 6 месяцев - скидка 10%</li>
                    <li className='border-b px-10 py-2'>2. Оплата за 12 месяцев - скидка 15%</li>
                    <li className='border-b px-10 py-2'>3. За приведенного друга - скидка 25%</li>
                    <li className='border-b px-10 py-2'>(Копировать готовый текст рекомендации для рассылки друзьям - <a className='text-blue-500' href="https://araratchess.ru/info/#Recommendation" target='_blank'>https://araratchess.ru/info/#Recommendation</a> )</li>
                </ul>
                <div className="bg-white flex flex-col p-5 text-center max-w-[520px] w-full">
                    <h1 className='text-center mb-3 uppercase font-bold text-[#8a6e3e] text-3xl max-2xl:text-xl max-2xl:mb-1'>Реквизиты</h1>
                    <h2 className='text-yellow-400 text-2xl font-semibold mb-3'>{info.name}</h2>
                    <div className="flex flex-col border">
                        {user.requizits === 2 &&
                            <div className="flex flex-col border-b text-center px-10 py-2">
                                <p className='font-bold'>Можно сделать перевод по ссылке:</p>
                                <a className='text-yellow-400 font-bold' href="https://www.tinkoff.ru/rm/grigoryan.grachya11/Mkxqm91526">https://www.tinkoff.ru/rm/grigoryan.grachya11/Mkxqm91526</a>
                            </div>
                        }
                        <p className='border-b px-10 py-2'>Номер карты: <span className='text-red-500 font-bold'>{info.number}</span> <span className='font-bold italic cursor-pointer' onClick={() => { copy(info.number); setCopyState({ number: true, en: false, ru: false, bik: false }) }}>({copyState.number ? 'скопировано' : 'копировать'})</span></p>
                        <p className='border-b px-10 py-2'>{info.en} <span className='font-bold italic cursor-pointer' onClick={() => { copy(info.en); setCopyState({ number: false, en: true, ru: false, bik: false }) }}>({copyState.en ? 'скопировано' : 'копировать'})</span></p>
                        <p className='border-b px-10 py-2'>{info.ru} <span className='font-bold italic cursor-pointer' onClick={() => { copy(info.ru); setCopyState({ number: false, en: false, ru: true, bik: false }) }}>({copyState.ru ? 'скопировано' : 'копировать'})</span></p>
                        <p className='px-10 py-2'>Бик: <span className='text-red-500 font-bold'>{info.bik}</span> <span className='font-bold italic cursor-pointer' onClick={() => { copy(info.bik); setCopyState({ number: false, en: false, ru: false, bik: true }) }}>({copyState.bik ? 'скопировано' : 'копировать'})</span></p>
                        {(user.requizits === 4 || user.requizits === 5) &&
                            <>
                                <p className='border-t px-10 py-2 max-w-[600px]'>(перевод можно сделать по ФИО или по номеру карты с разных приложений, рекомендуем <b>MoneyGram</b>, <b>Ria</b>, <b>Profee</b>, <b>TransferGo</b>.)</p>
                                <Disclosure as='div' className='mb-2 w-full max-w-[600px] px-3'>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-300 px-4 py-3 text-left text-base font-medium text-gray-900 hover:bg-gray-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                                <span className='font-bold'>ВАЖНО! Ваши переводы не проходят конвертации. Подробнее...</span>
                                                {open ? <IoIosArrowUp className='h-5 w-5 text-gray-900' /> : <IoIosArrowDown className='h-5 w-5 text-gray-900' />}

                                            </Disclosure.Button>
                                            <Disclosure.Panel className="border border-gray-300 px-4 pt-4 pb-2 text-base text-gray-900 whitespace-pre-wrap">
                                                <p className='mb-5'>Если вы делаете перевод в рублях по реквизитам рубли, в CRM-системе в личном кабинете вы увидите счет в рублях.</p>
                                                <p className='mb-5'>Если вы делаете перевод в евро по реквизитам евро, в CRM в личном кабинете вы увидите счет в рублях, <b>НО ВАША ОПЛАТА НИКАКИЕ КОНВЕРТАЦИИ НЕ ПРОХОДИТ</b>.</p>
                                                <p>Например, если вы оплатили 40 евро за 8 занятий, то на ваш счёт в личном кабинете будут зачислены 8 занятий, но 3000 рублей, независимо от курса евро. В CRM-системе оплата ведётся только в рублях.</p>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            </>
                        }
                    </div>
                </div>
            </div>
            <p className='font-bold text-xl mb-3'>Напишите администратору школы - <a target='_blank' className='text-blue-500' href="https://puzzle.araratchess.com/messenger/chat/651c1e9fbfbc95c1f9d7f8b8">https://puzzle.araratchess.com/messenger/chat/651c1e9fbfbc95c1f9d7f8b8</a>, если:</p>
            <ul className='mb-5 max-2xl:mb-0'>
                <li className='mb-6 max-2xl:mb-4'>1. Здравствуйте Администратор школы, на портале мы видим армянские реквизиты в валюте Евро, но нам нужны русские реквизиты в Рублях. <span className='font-bold italic cursor-pointer' onClick={() => { copy('Здравствуйте администратор школы, в портале видим армянские реквизиты в валюте евро, но нам нужны русские реквизиты в рубли.'); setCopy2(true) }}>({copy2 ? 'скопировано' : 'копировать'})</span></li>
                <li className='mb-2'>2. Здравствуйте Администратор школы, на портале мы видим русские реквизиты в Рублях, но нам нужны армянские реквизиты в валюте Евро. <span className='font-bold italic cursor-pointer' onClick={() => { copy('Здравствуйте администратор школы, в портале видим русские реквизиты в рубли, но нам нужны армянские реквизиты в валюте евро.'); setCopy1(true) }}>({copy1 ? 'скопировано' : 'копировать'})</span></li>
                <li className='mb-2'>3. Здравствуйте Администратор школы, на портале мы видим русские реквизиты в Рублях платежной системы Сбербанк, но нам нужны русские реквизиты платежной системы Тинькофф. <span className='font-bold italic cursor-pointer' onClick={() => { copy('Здравствуйте администратор школы, в портале видим русские реквизиты в рубли Сбербанк, но нам нужны русские реквизиты в рубли Тинькофф.'); setCopy3(true) }}>({copy3 ? 'скопировано' : 'копировать'})</span></li>
                <li className='mb-4'>4. Здравствуйте Администратор школы, на портале мы видим русские реквизиты в Рублях платежной системы Тинькофф, но нам нужны русские реквизиты платежной системы Сбербанк. <span className='font-bold italic cursor-pointer' onClick={() => { copy('Здравствуйте администратор школы, в портале видим русские реквизиты в рубли Тинькофф, но нам нужны русские реквизиты в рубли Сбербанк.'); setCopy4(true) }}>({copy4 ? 'скопировано' : 'копировать'})</span></li>
            </ul>

            <div className="max-w-[calc(100%-300px)] max-2xl:max-w-[calc(100%-100px)] flex flex-col justify-center items-center justify-items-center">
                <p className='text-center text-red-500 text-2xl font-bold'>Основные абонементы, после оплаты отправьте, пожалуйста чек <span className='text-red-900 cursor-pointer' onClick={() => handleChatAdmin()} >администратору</span></p>
                <img className='' src={Abonements} alt="abonements" />
            </div>
            <a className='bg-gradient-button rounded-full px-10 py-3 font-semibold text-2xl shadow-lg mt-10 max-2xl:mt-5 mb-5 max-2xl:mb-5 hover:bg-gradient-appricot' href="https://araratchess.ru/prices/" target='_blank'>Все абонементы на официальном сайте</a>
            <div className="max-w-[calc(100%-300px)] max-2xl:max-w-[calc(100%-100px)] mr-10"><img src={Abonements2} alt="abonements" /></div>
            <Modal noclosable={true} active={modal} className='!max-w-[700px]' setActive={setModal}>
                <div className="flex flex-col items-center">
                    <h1 className='text-center text-xl'>Для оплаты обучения вам нужны:<br /> 1. Армянские реквизиты в валюте евро.<br />2. Русские реквизиты в валюте рубли.</h1>
                    <div className="flex items-center mt-3">
                        <MainButton className='mr-5' onClick={() => void setRequizitsHandler('arm')}>Армянские</MainButton>
                        <MainButton onClick={() => void setRequizitsHandler('russian')}>Русские</MainButton>
                    </div>
                </div>
            </Modal>
            {/*<Tab.Group as='div' className='px-52'>
                <Tab.List as='div' className='flex'>
                    <Tab as='div' className='cursor-pointer'>
                        <p>Малыши 4-7 лет</p>
                        <p>Уроки по 40 минут</p>
                        <p className='font-bold'>Кандидат в мастер спорта</p>
                    </Tab>
                    <Tab as='div' className='cursor-pointer'>
                        <p>Дети 7+ лет</p>
                        <p>Уроки по 60 минут</p>
                        <p className='font-bold'>Кандидат в мастер спорта</p>
                    </Tab>
                    <Tab as='div' className='cursor-pointer'>
                        <p>Дети 7+ лет</p>
                        <p>Уроки по 60 минут</p>
                        <p className='font-bold'>Международный мастер</p>
                    </Tab>
                    <Tab as='div' className='cursor-pointer'>
                        <p>Дети 7+ лет</p>
                        <p>Уроки по 90 минут</p>
                        <p className='font-bold'>Международный гроссмейстер</p>
                    </Tab>
                    <Tab as='div' className='cursor-pointer'>
                        <p>Для любителей от 20 лет</p>
                        <p>Уроки по 60 минут</p>
                        <p className='font-bold'>Кандидат в мастер спорта</p>
                    </Tab>
                </Tab.List>
                <Tab.Panels as='div' className='w-full'>
                    <Tab.Panel as='div' className='flex w-full flex-col'>
                        <div className="flex justify-between mb-5 w-full">
                            <div className="flex flex-col">
                                <p>8 занятий КМС, 2 раза в неделю<br/>(группа до 4-5 учеников)</p>
                                <p>33 EUR / 3 300 RUB / за месяц</p>
                                <p>4 EUR / 410 RUB / за 1 занятие</p>
                            </div>
                            <div className="flex flex-col">
                                <p>4 занятия КМС, 1 раз в неделю<br/>(индивидуально)</p>
                                <p>40 EUR / 4 000 RUB / за месяц</p>
                                <p>10 EUR / 1 000 RUB / за 1 занятие</p>
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                                <p>12 занятий КМС, 3 раза в неделю<br/>(группа до 4-5 учеников)</p>
                                <p>45 EUR / 4 500 RUB / за месяц</p>
                                <p>4 EUR / 370 RUB / за 1 занятие</p>
                            </div>
                            <div className="flex flex-col">
                                <p>8 занятий КМС, 2 раза в неделю<br/>(индивидуально)</p>
                                <p>80 EUR / 8 000 RUB / за месяц</p>
                                <p>10 EUR / 1 000 RUB / за 1 занятие</p>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel as='div' className='flex w-full flex-col'>
                        <div className="flex justify-between mb-5 w-full">
                            <div className="flex flex-col">
                                <p>8 занятий КМС, 2 раза в неделю<br/>(группа до 6 учеников)</p>
                                <p>45 EUR / 4 500 RUB / за месяц</p>
                                <p>5 EUR / 560 RUB / за 1 занятие</p>
                            </div>
                            <div className="flex flex-col">
                                <p>4 занятия КМС, 1 раз в неделю<br/>(индивидуально)</p>
                                <p>60 EUR / 6 000 RUB / за месяц</p>
                                <p>15 EUR / 1 500 RUB / за 1 занятие</p>
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                                <p>12 занятий КМС, 3 раза в неделю<br/>(группа до 6 учеников)</p>
                                <p>60 EUR / 6 000 RUB / за месяц</p>
                                <p>5 EUR / 500 RUB / за 1 занятие</p>
                            </div>
                            <div className="flex flex-col">
                                <p>8 занятий КМС, 2 раза в неделю<br/>(индивидуально)</p>
                                <p>120 EUR / 12 000 RUB / за месяц</p>
                                <p>15 EUR / 1 500 RUB / за 1 занятие</p>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel as='div' className='flex w-full flex-col'>
                        <div className="flex justify-between mb-5 w-full">
                            <div className="flex flex-col">
                                <p>8 занятий ММ, 2 раза в неделю<br/>(группа до 5 учеников)</p>
                                <p>70 EUR / 7 000 RUB / за месяц</p>
                                <p>8 EUR / 875 RUB / за 1 занятие</p>
                            </div>
                            <div className="flex flex-col">
                                <p>4 занятия ММ, 1 раз в неделю<br/>(индивидуально)</p>
                                <p>120 EUR / 12 000 RUB / за месяц</p>
                                <p>30 EUR / 3 000 RUB / за 1 занятие</p>
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                                <p>12 занятий ММ, 3 раза в неделю<br/>(группа до 5 учеников)</p>
                                <p>95 EUR / 9 500 RUB / за месяц</p>
                                <p>8 EUR / 875 RUB / за 1 занятие</p>
                            </div>
                            <div className="flex flex-col">
                                <p>8 занятий ММ, 2 раза в неделю<br/>(индивидуально)</p>
                                <p>240 EUR / 24 000 RUB / за месяц</p>
                                <p>30 EUR / 3 000 RUB / за 1 занятие</p>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel as='div' className='flex w-full flex-col'>
                        <div className="flex justify-between mb-5 w-full">
                            <div className="flex flex-col">
                                <p>8 занятий ММ, 2 раза в неделю<br/>(группа до 5 учеников)</p>
                                <p>70 EUR / 7 000 RUB / за месяц</p>
                                <p>8 EUR / 875 RUB / за 1 занятие</p>
                            </div>
                            <div className="flex flex-col">
                                <p>4 занятия ММ, 1 раз в неделю<br/>(индивидуально)</p>
                                <p>120 EUR / 12 000 RUB / за месяц</p>
                                <p>30 EUR / 3 000 RUB / за 1 занятие</p>
                            </div>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>Content 5</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>*/}
        </div>
    )
}

export default Balance;
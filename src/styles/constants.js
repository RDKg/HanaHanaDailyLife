import adventureEventAvatar from '../../assets/ico/events/adventure-event-avatar.svg';
import anotherEventAvatar from '../../assets/ico/events/another-event-avatar.svg';
import cleanEventAvatar from '../../assets/ico/events/clean-event-avatar.svg';
import foodEventAvatar from '../../assets/ico/events/food-event-avatar.svg';
import geoEventAvatar from '../../assets/ico/events/geo-event-avatar.svg';
import healthEventAvatar from '../../assets/ico/events/health-event-avatar.svg';
import hygieneEventAvatar from '../../assets/ico/events/hygiene-event-avatar.svg';
import inviteEventAvatar from '../../assets/ico/events/invite-event-avatar.svg';
import meetingEventAvatar from '../../assets/ico/events/meeting-event-avatar.svg';
import petEventAvatar from '../../assets/ico/events/pet-event-avatar.svg';
import relaxEventAvatar from '../../assets/ico/events/relax-event-avatar.svg';
import shopEventAvatar from '../../assets/ico/events/shop-event-avatar.svg';
import sleepEventAvatar from '../../assets/ico/events/sleep-event-avatar.svg';
import sportEventAvatar from '../../assets/ico/events/sport-event-avatar.svg';
import studyEventAvatar from '../../assets/ico/events/study-event-avatar.svg';
import taskEventAvatar from '../../assets/ico/events/task-event-avatar.svg';
import walkEventAvatar from '../../assets/ico/events/walk-event-avatar.svg';
import workEventAvatar from '../../assets/ico/events/work-event-avatar.svg';
import PlusEventAvatar from '../../assets/ico/events/add-event-avatar.svg'

export const fontFiles = {
    RalewayThin: require('../../assets/fonts/Raleway-Thin.ttf'),
    RalewayExtraLight: require('../../assets/fonts/Raleway-ExtraLight.ttf'),
    RalewayLight: require('../../assets/fonts/Raleway-Light.ttf'),
    RalewayRegular: require('../../assets/fonts/Raleway-Regular.ttf'),
    RalewayMedium: require('../../assets/fonts/Raleway-Medium.ttf'),
    RalewaySemiBold: require('../../assets/fonts/Raleway-SemiBold.ttf'),
    RalewayBold: require('../../assets/fonts/Raleway-Bold.ttf'),
    RalewayExtraBold: require('../../assets/fonts/Raleway-ExtraBold.ttf'),
    RalewayBlack: require('../../assets/fonts/Raleway-Black.ttf'),
};

export const avatars = {
    adventureEventAvatar,
    anotherEventAvatar,
    cleanEventAvatar,
    foodEventAvatar,
    geoEventAvatar,
    healthEventAvatar,
    hygieneEventAvatar,
    inviteEventAvatar,
    meetingEventAvatar,
    petEventAvatar,
    relaxEventAvatar,
    shopEventAvatar,
    sleepEventAvatar,
    sportEventAvatar,
    studyEventAvatar,
    taskEventAvatar,
    walkEventAvatar,
    workEventAvatar,
    PlusEventAvatar,
};

export const defaultCategories = {
    0: {
        title: 'Прогулка',
        avatar: 'walkEventAvatar',
        activities: ['Пикник', 'Экскурсия', 'Обычная прогулка', 'Прогулка на транспорте', 'Другое']
    },
    1: {
        title: 'Работа',
        avatar: 'workEventAvatar',
        activities: ['Работа', 'Учеба', 'Волонтерство', 'Командировка', 'Конференция', 'Тренинги', 'Курсы', 'Другое']
    },
    2: {
        title: 'Встреча',
        avatar: 'meetingEventAvatar',
        activities: ['Свидание', 'Деловая встреча', 'Личная встреча', 'Переговоры', 'Интервью', 'Консультация', 'Собеседование', 'Другое']
    },
    3: {
        title: 'Питание',
        avatar: 'foodEventAvatar',
        activities: ['Кафе', 'Ресторан', 'Бар', 'Дом', 'Другое']
    },
    4: {
        title: 'Отдых',
        avatar: 'relaxEventAvatar',
        activities: ['Сон', 'Просмотр фильма/сериала', 'Природа', 'Театр', 'Концерт', 'Медитация', 'Общение', 'Игры', 'Чтение', 'Другое']
    },
    5: {
        title: 'Уборка',
        avatar: 'cleanEventAvatar',
        activities: ['Генеральная уборка', 'Обычная уборка', 'Другое']
    },
    6: {
        title: 'Гигиена',
        avatar: 'hygieneEventAvatar',
        activities: ['Ванная', 'Душ', 'Баня', 'Сауна', 'Парикмахерская', 'Салон красоты', 'Косметические процедуры', 'Уход за телом', 'Другое']
    },
    7: {
        title: 'Питомец',
        avatar: 'petEventAvatar',
        activities: ['Кормление', 'Выгул', 'Дрессировка/тренировка', 'Ветеринар', 'Чистка/гигиена', 'Другое']
    },
    8: {
        title: 'Магазин',
        avatar: 'shopEventAvatar',
        activities: ['Продуктовый магазин', 'Торговый центр', 'Одежда', 'Обувь', 'Косметика', 'Техника', 'Мебель', 'Подарки', 'Книги', 'Аптека', 'Цветы', 'Для питомца', 'Автомагазин', 'Строительный магазин', 'Другое']
    },
    9: {
        title: 'Здоровье',
        avatar: 'healthEventAvatar',
        activities: ['Врач', 'Спорт', 'Лечебные процедуры', 'Спортзал', 'Бассейн', 'Другое']
    },
    10: {
        title: 'Приключение',
        avatar: 'adventureEventAvatar',
        activities: ['Поход', 'Туризм', 'Охота', 'Рыбалка', 'Исследование', 'Полет', 'Поездка', 'Путешествие', 'Другое']
    },
}

export const padding = 15;
export const margin = 10;
export const borderRadius = 15;
export const heightNavTab = 75;

export const pinkColor = {rgb: [249, 145, 182], a: 1.0};
export const purpleColor = {rgb: [135, 128, 246], a: 1.0};
export const blackColor = {rgb: [82, 82, 82], a: 1.0};
export const greenColor = {rgb: [142, 234, 151], a: 1.0};
export const whiteColor = {rgb: [249, 249, 249], a: 1.0};
export const grayColor = {rgb: [242, 242, 242], a: 1.0};

export const pinkToPurpleGradient = {
    colors: ['rgba(249,84,143, 1.0)', 'rgba(144,108,249, 1.0)'],
    start: {x: 0, y: 0}, 
    end: {x: 1, y: 1},
};
export const pinkToPurpleLightGradient = {
    colors: ['rgba(245,160,190, 1)', 'rgba(122,128,255, 1)'], 
    start: {x: 0, y: 0},
    end: {x: 1, y: 1}
};
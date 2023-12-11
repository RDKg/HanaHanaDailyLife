import adventureTaskAvatar from '../assets/ico/tasks/adventure-task-avatar.svg';
import anotherTaskAvatar from '../assets/ico/tasks/another-task-avatar.svg';
import cleanTaskAvatar from '../assets/ico/tasks/clean-task-avatar.svg';
import foodTaskAvatar from '../assets/ico/tasks/food-task-avatar.svg';
import geoTaskAvatar from '../assets/ico/tasks/geo-task-avatar.svg';
import healthTaskAvatar from '../assets/ico/tasks/health-task-avatar.svg';
import hygieneTaskAvatar from '../assets/ico/tasks/hygiene-task-avatar.svg';
import inviteTaskAvatar from '../assets/ico/tasks/invite-task-avatar.svg';
import meetingTaskAvatar from '../assets/ico/tasks/meeting-task-avatar.svg';
import petTaskAvatar from '../assets/ico/tasks/pet-task-avatar.svg';
import relaxTaskAvatar from '../assets/ico/tasks/relax-task-avatar.svg';
import shopTaskAvatar from '../assets/ico/tasks/shop-task-avatar.svg';
import sleepTaskAvatar from '../assets/ico/tasks/sleep-task-avatar.svg';
import sportTaskAvatar from '../assets/ico/tasks/sport-task-avatar.svg';
import studyTaskAvatar from '../assets/ico/tasks/study-task-avatar.svg';
import taskTaskAvatar from '../assets/ico/tasks/task-task-avatar.svg';
import walkTaskAvatar from '../assets/ico/tasks/walk-task-avatar.svg';
import workTaskAvatar from '../assets/ico/tasks/work-task-avatar.svg';
import addTaskAvatar from '../assets/ico/tasks/add-task-avatar.svg';

export const TASKS_AVATARS = {
    adventureTaskAvatar,
    anotherTaskAvatar,
    cleanTaskAvatar,
    foodTaskAvatar,
    geoTaskAvatar,
    healthTaskAvatar,
    hygieneTaskAvatar,
    inviteTaskAvatar,
    meetingTaskAvatar,
    petTaskAvatar,
    relaxTaskAvatar,
    shopTaskAvatar,
    sleepTaskAvatar,
    sportTaskAvatar,
    studyTaskAvatar,
    taskTaskAvatar,
    walkTaskAvatar,
    workTaskAvatar,
    addTaskAvatar,
};

export const FONT_FILES = {
    RalewayThin: require('../assets/fonts/Raleway-Thin.ttf'),
    RalewayExtraLight: require('../assets/fonts/Raleway-ExtraLight.ttf'),
    RalewayLight: require('../assets/fonts/Raleway-Light.ttf'),
    RalewayRegular: require('../assets/fonts/Raleway-Regular.ttf'),
    RalewayMedium: require('../assets/fonts/Raleway-Medium.ttf'),
    RalewaySemiBold: require('../assets/fonts/Raleway-SemiBold.ttf'),
    RalewayBold: require('../assets/fonts/Raleway-Bold.ttf'),
    RalewayExtraBold: require('../assets/fonts/Raleway-ExtraBold.ttf'),
    RalewayBlack: require('../assets/fonts/Raleway-Black.ttf'),
};

export const DEFAULT_DATABASE_DATA = {
    0: {
        title: 'Прогулка',
        avatar: 'walkTaskAvatar',
        activities: ['Пикник', 'Экскурсия', 'Обычная прогулка', 'Прогулка на транспорте', 'Другое']
    },
    1: {
        title: 'Работа',
        avatar: 'workTaskAvatar',
        activities: ['Работа', 'Учеба', 'Волонтерство', 'Командировка', 'Конференция', 'Тренинги', 'Курсы', 'Другое']
    },
    2: {
        title: 'Встреча',
        avatar: 'meetingTaskAvatar',
        activities: ['Свидание', 'Деловая встреча', 'Личная встреча', 'Переговоры', 'Интервью', 'Консультация', 'Собеседование', 'Другое']
    },
    3: {
        title: 'Питание',
        avatar: 'foodTaskAvatar',
        activities: ['Кафе', 'Ресторан', 'Бар', 'Дом', 'Другое']
    },
    4: {
        title: 'Отдых',
        avatar: 'relaxTaskAvatar',
        activities: ['Сон', 'Просмотр фильма/сериала', 'Природа', 'Театр', 'Концерт', 'Медитация', 'Общение', 'Игры', 'Чтение', 'Другое']
    },
    5: {
        title: 'Уборка',
        avatar: 'cleanTaskAvatar',
        activities: ['Генеральная уборка', 'Обычная уборка', 'Другое']
    },
    6: {
        title: 'Гигиена',
        avatar: 'hygieneTaskAvatar',
        activities: ['Ванная', 'Душ', 'Баня', 'Сауна', 'Парикмахерская', 'Салон красоты', 'Косметические процедуры', 'Уход за телом', 'Другое']
    },
    7: {
        title: 'Питомец',
        avatar: 'petTaskAvatar',
        activities: ['Кормление', 'Выгул', 'Дрессировка/тренировка', 'Ветеринар', 'Чистка/гигиена', 'Другое']
    },
    8: {
        title: 'Магазин',
        avatar: 'shopTaskAvatar',
        activities: ['Продуктовый магазин', 'Торговый центр', 'Одежда', 'Обувь', 'Косметика', 'Техника', 'Мебель', 'Подарки', 'Книги', 'Аптека', 'Цветы', 'Для питомца', 'Автомагазин', 'Строительный магазин', 'Другое']
    },
    9: {
        title: 'Здоровье',
        avatar: 'healthTaskAvatar',
        activities: ['Врач', 'Спорт', 'Лечебные процедуры', 'Спортзал', 'Бассейн', 'Другое']
    },
    10: {
        title: 'Приключение',
        avatar: 'adventureTaskAvatar',
        activities: ['Поход', 'Туризм', 'Охота', 'Рыбалка', 'Исследование', 'Полет', 'Поездка', 'Путешествие', 'Другое']
    },
}

export const PADDING = 15;
export const MARGIN = 10;
export const BORDER_RADIUS = 15;
export const HEIGHT_NAVIGATION_TAB = 75;

export const PINK_COLOR = {rgb: [249, 145, 182], a: 1.0};
export const PURPLE_COLOR = {rgb: [135, 128, 246], a: 1.0};
export const BLACK_COLOR = {rgb: [82, 82, 82], a: 1.0};
export const GREEN_COLOR = {rgb: [142, 234, 151], a: 1.0};
export const WHITE_COLOR = {rgb: [249, 249, 249], a: 1.0};
export const GRAY_COLOR = {rgb: [242, 242, 242], a: 1.0};

export const PINK_TO_PURPLE_GRADIENT = {
    colors: ['rgba(249,84,143, 1.0)', 'rgba(144,108,249, 1.0)'],
    start: {x: 0, y: 0}, 
    end: {x: 1, y: 1},
};
export const PINK_TO_PURPLE_LIGHT_GRADIENT = {
    colors: ['rgba(245,160,190, 1)', 'rgba(122,128,255, 1)'], 
    start: {x: 0, y: 0},
    end: {x: 1, y: 1}
};
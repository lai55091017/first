import Firestore from "./firebase/Firestore.js";
const fs = new Firestore;

const Regexmapping = [
    { type: 'doors', regex: /^(Door_(L|R)_Home|LIB_Door_(Left|Right)|Door_School_(Left|Right))$/, newName: 'Door' },
    { type: 'chairs', regex: /^.*Chair.*/, newName: 'Chair' },
    { type: 'tables', regex: /^(LIB_Table_\d+|.*_table|Table_.*|Bedroom_Desk)$/, newName: 'Table' },
    { type: 'counters', regex: /^counter\d+$/, newName: 'Counter' },
    { type: 'bookshelves', regex: /^.*Bookshelf\d+(_\d+)*$/, newName: 'Bookshelf' },
    { type: 'sofas', regex: /^Sofa_\d+$/, newName: 'Sofa' },
    { type: 'fridge', regex: /^Kitchen_fridge$/, newName: 'Fridge' },
    { type: 'bar', regex: /^Kitchen_bar.*/, newName: 'Bar' },
    { type: 'tv', regex: /^TV0.*/, newName: 'TV' },
    { type: 'tub', regex: /^Toilet_Tub$/, newName: 'Tub' },
    { type: 'toilet', regex: /^Toilet_toilet$/, newName: 'Toilet' },
    { type: 'sink', regex: /^.*sink.*$/, newName: 'Sink' },
    { type: 'bed', regex: /^Bedroom_Bed.*$/, newName: 'Bed' },
    { type: 'wardrobe', regex: /^Bedroom_wardrobe.*/, newName: 'Wardrobe' },
    { type: 'podium', regex: /^Podium$/, newName: 'Podium' },
    { type: 'lectern', regex: /^Lectern$/, newName: 'Lectern' },
    { type: 'blackboard', regex: /^School_Blackboard.*/, newName: 'Blackboard' },
    { type: 'tvshelves', regex: /^TV_shelf_\d+$/, newName: 'TV Shelf' },
    { type: 'rangehood', regex: /^Kitchen_range_hood/, newName: 'Range hood' },
    { type: 'cabinets', regex: /^Kitchen_cabinet_.*/, newName: 'Cabinet' },
    { type: 'gasstoves', regex: /^Kitchen_gas_stove.*/, newName: 'Gas stove' },
    { type: 'shelf', regex: /^Toilet_shelf/, newName: 'Toilet shelf' },
    { type: 'labtop', regex: /^Office_Labtop.*/, newName: 'Labtop' },
    { type: 'books', regex: /^Book_.*/, newName: 'Book' },
    { type: 'wordle', regex: /^wordle.*/, newName: 'Wordle Game' },
    { type: 'memory', regex: /^The_Choosen_Book/, newName: 'Memory Game' },
    { type: 'slide', regex: /^Park_Slide.*/, newName: 'Slide' },
    { type: 'bench', regex: /^Park_Bench.*/, newName: 'Bench' },
    { type: 'ball', regex: /^Park_Ball.*/, newName: 'Ball' },
    { type: 'seesaw', regex: /^Park_Seesaw.*/, newName: 'Seesaw' },
    { type: 'plant', regex: /^Park_plant.*/, newName: 'Plant' },
    { type: 'trashcan', regex: /^Park_Trash_Can/, newName: 'Trash can' },
    { type: 'swing', regex: /^Park_Swing.*/, newName: 'Swing' },
    { type: 'monkeybars', regex: /^Park_Monkey_bars.*/, newName: 'Monkey bar' },
    { type: 'fence', regex: /^Park_Fence.*/, newName: 'Fence' },
    { type: 'trees', regex: /^Park_triangle_tree.*/, newName: 'Tree' },
    { type: 'playground', regex: /^Park_Playground.*/, newName: 'Playground' }
];

const InteractableObject = [
    {
        id: 'Door',
        chineseName: '門',
        englishName: 'Door'
    },
    {
        id: 'Chair',
        chineseName: '椅子',
        englishName: 'Chair'
    },
    {
        id: 'Table',
        chineseName: '桌子',
        englishName: 'Table'
    },
    {
        id: 'Counter',
        chineseName: '櫃台',
        englishName: 'Counter'
    },
    {
        id: 'Bookshelf',
        chineseName: '書架',
        englishName: 'Bookshelf'
    },
    {
        id: 'Sofa',
        chineseName: '沙發',
        englishName: 'Sofa'
    },
    {
        id: 'Fridge',
        chineseName: '冰箱',
        englishName: 'Fridge'
    },
    {
        id: 'Bar',
        chineseName: '吧台',
        englishName: 'Bar'
    },
    {
        id: 'TV',
        chineseName: '電視',
        englishName: 'TV'
    },
    {
        id: 'Tub',
        chineseName: '浴缸',
        englishName: 'Tub'
    },
    {
        id: 'Toilet',
        chineseName: '馬桶',
        englishName: 'Toilet'
    },
    {
        id: 'Sink',
        chineseName: '洗手槽',
        englishName: 'Sink'
    },
    {
        id: 'Bed',
        chineseName: '床',
        englishName: 'Bed'
    },
    {
        id: 'Wardrobe',
        chineseName: '衣櫃',
        englishName: 'Wardrobe'
    },
    {
        id: 'Podium',
        chineseName: '講台',
        englishName: 'Podium'
    },
    {
        id: 'Lectern',
        chineseName: '講桌',
        englishName: 'Lectern'
    },
    {
        id: 'Blackboard',
        chineseName: '黑板',
        englishName: 'Blackboard'
    },
    {
        id: 'TV Shelf',
        chineseName: '電視櫃',
        englishName: 'TV Shelf'
    },
    {
        id: 'Range hood',
        chineseName: '抽油煙機',
        englishName: 'Range hood'
    },
    {
        id: 'Cabinet',
        chineseName: '櫥櫃',
        englishName: 'Cabinet'
    },
    {
        id: 'Gas stove',
        chineseName: '瓦斯爐',
        englishName: 'Gas stove'
    },
    {
        id: 'Toilet shelf',
        chineseName: '廁所置物架',
        englishName: 'Toilet shelf'
    },
    {
        id: 'Labtop',
        chineseName: '筆電',
        englishName: 'Labtop'
    },
    {
        id: 'Book',
        chineseName: '書籍',
        englishName: 'Book'
    },
    {
        id: 'Slide',
        chineseName: '滑梯',
        englishName: 'Slide'
    },
    {
        id: 'Bench',
        chineseName: '長椅',
        englishName: 'Bench'
    },
    {
        id: 'Ball',
        chineseName: '球',
        englishName: 'Ball'
    },
    {
        id: 'Seesaw',
        chineseName: '翹翹板',
        englishName: 'Seesaw'
    },
    {
        id: 'Plant',
        chineseName: '植物',
        englishName: 'Plant'
    },
    {
        id: 'Trash can',
        chineseName: '垃圾桶',
        englishName: 'Trash can'
    },
    {
        id: 'Swing',
        chineseName: '鞦韆',
        englishName: 'Swing'
    },
    {
        id: 'Monkey bar',
        chineseName: '單槓',
        englishName: 'Monkey bar'
    },
    {
        id: 'Fence',
        chineseName: '柵欄',
        englishName: 'Fence'
    },
    {
        id: 'Playground',
        chineseName: '操場',
        englishName: 'Playground'
    },
    {
        id: 'Tree',
        chineseName: '樹',
        englishName: 'Tree'
    }
];

fs.save_scene_regexmapping(Regexmapping);
fs.save_scene_InteractableObject(InteractableObject);
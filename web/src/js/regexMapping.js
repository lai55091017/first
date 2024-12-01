import Firestore from "./js/firebase/Firestore.js";

const fs = new Firestore;

const data = [
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

fs.save_scene_regex_mapping(data);
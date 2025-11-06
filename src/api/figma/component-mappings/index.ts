import { ButtonMapping } from './Button';
import { TextFieldMapping } from './TextField';
import { TypographyMapping } from './Typography';
import { ChipMapping } from './Chip';
import { CardMapping } from './Card';
import { TableMapping } from './Table';
import { BoxMapping } from './Box';
import { StackMapping } from './Stack';
import { GridMapping } from './Grid';
import { IconButtonMapping } from './IconButton';
import { PaperMapping } from './Paper';
import { AvatarMapping } from './Avatar';
import { TabsMapping } from './Tabs';
import { ToggleButtonGroupMapping } from './ToggleButtonGroup';
import { AlertMapping } from './Alert';
import { AppBarMapping } from './AppBar';
import { ToolbarMapping } from './Toolbar';
import { LinkMapping } from './Link';
import { SelectMapping } from './Select';
import { CheckboxMapping } from './Checkbox';
import { SwitchMapping } from './Switch';
import { RadioMapping } from './Radio';
import { MenuItemMapping } from './MenuItem';
import { MenuMapping } from './Menu';
import { DialogMapping } from './Dialog';
import { DialogTitleMapping } from './DialogTitle';
import { DialogContentMapping } from './DialogContent';
import { DialogActionsMapping } from './DialogActions';
import { SnackbarMapping } from './Snackbar';
import { DividerMapping } from './Divider';
import { AlertTitleMapping } from './AlertTitle';
import { FormControlMapping } from './FormControl';
import { InputLabelMapping } from './InputLabel';
import { FormLabelMapping } from './FormLabel';
import { RadioGroupMapping } from './RadioGroup';
import { ToggleButtonMapping } from './ToggleButton';
import { TabMapping } from './Tab';
import { ListMapping } from './List';
import { ListItemMapping } from './ListItem';
import { ListItemTextMapping } from './ListItemText';
import { ListItemIconMapping } from './ListItemIcon';
import { FormControlLabelMapping } from './FormControlLabel';
import { TableContainerMapping } from './TableContainer';
import { TableHeadMapping } from './TableHead';
import { TableBodyMapping } from './TableBody';
import { TableRowMapping } from './TableRow';
import { TableCellMapping } from './TableCell';
import { TableFooterMapping } from './TableFooter';
import { CardContentMapping } from './CardContent';
import { CardActionsMapping } from './CardActions';
import { CardHeaderMapping } from './CardHeader';
import { CardMediaMapping } from './CardMedia';
import { BadgeMapping } from './Badge';
import { FabMapping } from './Fab';
import { CircularProgressMapping } from './CircularProgress';
import { LinearProgressMapping } from './LinearProgress';
import { DrawerMapping } from './Drawer';
import { AutocompleteMapping } from './Autocomplete';
import { AccordionMapping } from './Accordion';
import { BreadcrumbsMapping } from './Breadcrumbs';
import { SliderMapping } from './Slider';
import { RatingMapping } from './Rating';
import { PaginationMapping } from './Pagination';
import { SkeletonMapping } from './Skeleton';
import { BackdropMapping } from './Backdrop';
import { ContainerMapping } from './Container';
import { BottomNavigationMapping } from './BottomNavigation';
import { StepperMapping } from './Stepper';
import { SpeedDialMapping } from './SpeedDial';
import { ComponentMapping } from './types/PropertyMapper';

/**
 * 모든 컴포넌트 매핑
 */
export const COMPONENT_MAPPINGS = {
    button: ButtonMapping,
    input: TextFieldMapping,
    textField: TextFieldMapping,
    typography: TypographyMapping,
    chip: ChipMapping,
    card: CardMapping,
    cardContent: CardContentMapping,
    cardActions: CardActionsMapping,
    cardHeader: CardHeaderMapping,
    cardMedia: CardMediaMapping,
    table: TableMapping,
    stack: StackMapping,
    grid: GridMapping,
    iconButton: IconButtonMapping,
    paper: PaperMapping,
    avatar: AvatarMapping,
    tabs: TabsMapping,
    toggleButtonGroup: ToggleButtonGroupMapping,
    alert: AlertMapping,
    alertTitle: AlertTitleMapping,
    appBar: AppBarMapping,
    toolbar: ToolbarMapping,
    link: LinkMapping,
    select: SelectMapping,
    checkbox: CheckboxMapping,
    switch: SwitchMapping,
    radio: RadioMapping,
    menuItem: MenuItemMapping,
    menu: MenuMapping,
    dialog: DialogMapping,
    dialogTitle: DialogTitleMapping,
    dialogContent: DialogContentMapping,
    dialogActions: DialogActionsMapping,
    snackbar: SnackbarMapping,
    divider: DividerMapping,
    formControl: FormControlMapping,
    inputLabel: InputLabelMapping,
    formLabel: FormLabelMapping,
    radioGroup: RadioGroupMapping,
    toggleButton: ToggleButtonMapping,
    tab: TabMapping,
    list: ListMapping,
    listItem: ListItemMapping,
    listItemText: ListItemTextMapping,
    listItemIcon: ListItemIconMapping,
    formControlLabel: FormControlLabelMapping,
    tableContainer: TableContainerMapping,
    tableHead: TableHeadMapping,
    tableBody: TableBodyMapping,
    tableRow: TableRowMapping,
    tableCell: TableCellMapping,
    tableFooter: TableFooterMapping,
    badge: BadgeMapping,
    fab: FabMapping,
    circularProgress: CircularProgressMapping,
    linearProgress: LinearProgressMapping,
    drawer: DrawerMapping,
    autocomplete: AutocompleteMapping,
    accordion: AccordionMapping,
    breadcrumbs: BreadcrumbsMapping,
    slider: SliderMapping,
    rating: RatingMapping,
    pagination: PaginationMapping,
    skeleton: SkeletonMapping,
    backdrop: BackdropMapping,
    container: ContainerMapping,
    bottomNavigation: BottomNavigationMapping,
    stepper: StepperMapping,
    speedDial: SpeedDialMapping,
    // Layout 컴포넌트들도 Box로 매핑
    layout: BoxMapping,
    content: BoxMapping,
    submenu: BoxMapping,
    controlArea: BoxMapping,
} as const;

/**
 * 성능 최적화: 역방향 인덱스 Map 생성 (O(1) 검색)
 */
const FIGMA_NAME_TO_TYPE: Map<string, string> = new Map();
Object.entries(COMPONENT_MAPPINGS).forEach(([type, mapping]) => {
    mapping.figmaNames.forEach(name => {
        FIGMA_NAME_TO_TYPE.set(name, type);
    });
});

/**
 * 피그마 이름으로 매핑 찾기 (O(1) 최적화)
 */
export function findMappingByFigmaName(figmaName: string): ComponentMapping | null {
    const type = FIGMA_NAME_TO_TYPE.get(figmaName);
    return type ? (COMPONENT_MAPPINGS as any)[type] || null : null;
}

/**
 * 컴포넌트 타입으로 매핑 찾기
 * @param type componentType (예: 'layout', 'button', 'typography')
 * @returns ComponentMapping 또는 null
 */
export function findMappingByType(type: string): ComponentMapping | null {
    // 'layout' 타입은 실제로는 여러 레이아웃 컴포넌트를 포함하므로, 
    // 기본적으로 'stack' 매핑을 찾음 (Box는 별도 처리)
    if (type === 'layout') {
        return (COMPONENT_MAPPINGS as any)['stack'] || null;
    }
    
    return (COMPONENT_MAPPINGS as any)[type] || null;
}

/**
 * 피그마 이름으로 매핑 키(타입) 찾기
 * @param figmaName 피그마 컴포넌트 이름
 * @returns 매핑 키 (componentType)
 */
export function findMappingKeyByFigmaName(figmaName: string): string | null {
    return FIGMA_NAME_TO_TYPE.get(figmaName) || null;
}

/**
 * 모든 매핑 export
 */
export {
    ButtonMapping,
    TextFieldMapping,
    TypographyMapping,
    ChipMapping,
    CardMapping,
    TableMapping,
    BoxMapping,
    StackMapping,
    GridMapping,
    IconButtonMapping,
    PaperMapping,
    AvatarMapping,
    TabsMapping,
    ToggleButtonGroupMapping,
    AlertMapping,
    AlertTitleMapping,
    AppBarMapping,
    ToolbarMapping,
    LinkMapping,
    SelectMapping,
    CheckboxMapping,
    SwitchMapping,
    RadioMapping,
    MenuItemMapping,
    MenuMapping,
    DialogMapping,
    DialogTitleMapping,
    DialogContentMapping,
    DialogActionsMapping,
    SnackbarMapping,
    DividerMapping,
    FormControlMapping,
    InputLabelMapping,
    FormLabelMapping,
    RadioGroupMapping,
    ToggleButtonMapping,
    TabMapping,
    ListMapping,
    ListItemMapping,
    ListItemTextMapping,
    ListItemIconMapping,
    FormControlLabelMapping,
    TableContainerMapping,
    TableHeadMapping,
    TableBodyMapping,
    TableRowMapping,
    TableCellMapping,
    TableFooterMapping,
    CardContentMapping,
    CardActionsMapping,
    CardHeaderMapping,
    CardMediaMapping,
    BadgeMapping,
    FabMapping,
    CircularProgressMapping,
    LinearProgressMapping,
    DrawerMapping,
    AutocompleteMapping,
    AccordionMapping,
    BreadcrumbsMapping,
    SliderMapping,
    RatingMapping,
    PaginationMapping,
    SkeletonMapping,
    BackdropMapping,
    ContainerMapping,
    BottomNavigationMapping,
    StepperMapping,
    SpeedDialMapping,
};

export type { ComponentMapping };


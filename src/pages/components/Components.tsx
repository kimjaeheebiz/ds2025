import React from 'react';
import { orange, grey, blue, indigo, green, red } from '@mui/material/colors';
import {
    Box,
    Stack,
    Grid,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Switch,
    Radio,
    RadioGroup,
    FormControl,
    InputLabel,
    FormLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    Card,
    CardContent,
    CardActions,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
    AlertTitle,
    Snackbar,
    ToggleButton,
    ToggleButtonGroup,
    Tabs,
    Tab,
    GlobalStyles,
    InputAdornment,
    Menu,
    MenuItem as MenuItemComponent,
    ListItemIcon as ListItemIconComponent,
    ListItemText as ListItemTextComponent,
    useTheme,
} from '@mui/material';
import {
    Add,
    Search,
    Star,
    Settings,
    Person,
    Delete,
    Edit,
    Share,
    Home,
    Work,
    School,
} from '@mui/icons-material';

export const Components = () => {
    const theme = useTheme();

    // brand 하위에서 색상 그룹명 추출 (새로운 colors 구조)
    const brandColorGroupNames = theme.brand?.colors ? Object.keys(theme.brand.colors) : [];

    // 동적 색상 그룹명 (첫 번째 그룹을 기본으로 사용)
    const primaryColorGroup = brandColorGroupNames[0] || 'hecto';
    const testColorGroup = brandColorGroupNames.find(name => name.toLowerCase().includes('test')) || 'test';

    const [checked, setChecked] = React.useState(false);
    const [switchChecked, setSwitchChecked] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState('option1');
    const [selectValue, setSelectValue] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [toggleValueSmall, setToggleValueSmall] = React.useState('left');
    const [toggleValueMedium, setToggleValueMedium] = React.useState('left');
    const [toggleValueLarge, setToggleValueLarge] = React.useState('left');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    // 코드 힌트 공통 스타일
    const codeHintSx = {
        px: 0.6,
        bgcolor: 'action.selected',
        border: '1px solid',
        borderColor: 'action.focus',
        borderRadius: 1,
        color: 'info.dark'
    };

    // 섹션 이동 효과
    const scrollTo = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // 섹션 링크
    const sectionLinks = [
        { id: 'sectionColors', label: 'Colors' },
        { id: 'sectionTypography', label: 'Typography' },
        { id: 'sectionButtons', label: 'Buttons' },
        { id: 'sectionToggleButtons', label: 'Toggle Buttons' },
        { id: 'sectionChipsAvatars', label: 'Chips & Avatars' },
        { id: 'sectionFormControls', label: 'Form Controls' },
        { id: 'sectionCards', label: 'Cards' },
        { id: 'sectionTables', label: 'Tables' },
        { id: 'sectionLists', label: 'Lists' },
        { id: 'sectionAlerts', label: 'Alerts' },
        { id: 'sectionDialogs', label: 'Dialogs & Menus' },
        { id: 'sectionSnackbar', label: 'Snackbar' },
    ];

    const [activeSection, setActiveSection] = React.useState<string>('sectionColors');

    const toggleSizeState: Record<'small' | 'medium' | 'large', [string, React.Dispatch<React.SetStateAction<string>>]> = {
        small: [toggleValueSmall, setToggleValueSmall],
        medium: [toggleValueMedium, setToggleValueMedium],
        large: [toggleValueLarge, setToggleValueLarge],
    };

    const sizeToLabel: Record<'small' | 'medium' | 'large', string> = {
        small: 'Small',
        medium: 'Default(Medium)',
        large: 'Large',
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
            <GlobalStyles styles={{ '.section': { scrollMarginTop: 70 } }} />

            {/* 섹션 이동 메뉴 */}
            <Tabs
                value={activeSection}
                onChange={(e, v) => { setActiveSection(v); scrollTo(v); }}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="섹션 이동 메뉴"
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    bgcolor: 'background.default',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {sectionLinks.map((s) => (
                    <Tab key={s.id} value={s.id} label={s.label} />
                ))}
            </Tabs>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Colors */}
                <Box component="section" className="section" id="sectionColors">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Colors
                    </Typography>

                    <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ mb: 1 }}>
                        <Typography component="h3" variant="h6">
                            Theme Color (Mode/Theme 자동 반영)
                        </Typography>
                        <Typography component="code" variant="caption" sx={codeHintSx}>
                            {`{color}.{tone}`}
                        </Typography>
                    </Stack>
                    <Grid container spacing={2} sx={{ mb: 5 }}>
                        {(['primary', 'secondary', 'info', 'success', 'error', 'warning'] as const).map((key) => (
                            <Grid item key={key}>
                                <Typography variant="caption" sx={{ mb: 0.5 }}>{key}</Typography>
                                <Stack direction="row">
                                    {(['light', 'main', 'dark'] as const).map((tone) => (
                                        <Box key={`${key}-${tone}`} sx={{
                                            width: 40,
                                            height: 30,
                                            bgcolor: `${key}.${tone}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'primary.contrastText',
                                            typography: 'caption',
                                        }}>
                                            {tone}
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                    <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ mb: 1 }}>
                        <Typography component="h3" variant="h6">
                            Brand Colors ({primaryColorGroup})
                        </Typography>
                        <Typography component="code" variant="caption" sx={codeHintSx}>
                            {`${primaryColorGroup}.{color}.{shade}`}
                        </Typography>
                    </Stack>
                    <Grid container spacing={1} sx={{ mb: 5 }}>
                        {(['orange', 'blue', 'indigo', 'lime', 'green', 'deepgreen', 'grey'] as const).map((colorName) => (
                            <Grid item xs={12} xl={4} key={colorName}>
                                <Typography variant="caption">
                                    {colorName}
                                </Typography>
                                <Stack direction="row" flexWrap="wrap">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                        <Box key={`${colorName}-${shade}`} sx={{
                                            width: 40,
                                            height: 30,
                                            bgcolor: `${primaryColorGroup}.${colorName}.${shade}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: shade >= 500 ? '#fff' : '#000',
                                            typography: 'caption',
                                        }}>
                                            {shade}
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Test Color 그룹 */}
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                        <Typography component="h3" variant="h6">
                            Test Color Group
                        </Typography>
                        <Typography component="code" variant="caption" sx={codeHintSx}>
                            {`${testColorGroup}.{color}.{shade}`}
                        </Typography>
                    </Stack>
                    <Grid container spacing={1} sx={{ mb: 5 }}>
                        {(['blue', 'green', 'orange'] as const).map((colorName) => (
                            <Grid item xs={12} xl={4} key={colorName}>
                                <Typography variant="caption">
                                    {colorName}
                                </Typography>
                                <Stack direction="row" flexWrap="wrap">
                                    {[300, 500, 700].map((shade) => (
                                        <Box key={`${colorName}-${shade}`} sx={{
                                            width: 40,
                                            height: 30,
                                            bgcolor: `${testColorGroup}.${colorName}.${shade}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: shade >= 500 ? '#fff' : '#000',
                                            typography: 'caption',
                                        }}>
                                            {shade}
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                    <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ mb: 1 }}>
                        <Typography component="h3" variant="h6">
                            Material Color
                        </Typography>
                        <Typography component="code" variant="caption" sx={codeHintSx}>
                            {`{color}[{shade}]`}
                        </Typography>
                    </Stack>
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                        {([
                            ['orange', orange],
                            ['blue', blue],
                            ['indigo', indigo],
                            ['green', green],
                            ['red', red],
                            ['grey', grey],
                        ] as const).map(([name, palette]) => (
                            <Grid item xs={12} xl={4} key={name}>
                                <Typography variant="caption" sx={{ mb: 0.5 }}>{name}</Typography>
                                <Stack direction="row" flexWrap="wrap">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => (
                                        <Box key={`${name}-${s}`} sx={{
                                            width: 40,
                                            height: 30,
                                            bgcolor: (palette as any)[s],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: s >= 500 ? '#fff' : 'text.primary',
                                            typography: 'caption',
                                        }}>
                                            {s}
                                        </Box>
                                    ))}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                    {/* 색상 패턴 테스트 */}
                    <Typography component="h3" variant="h6" sx={{ mb: 1 }}>
                        *Color Pattern Test
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        {/* Brand Color 풀네임 패턴 테스트 */}
                        <Box sx={{
                            p: 1,
                            bgcolor: theme.brand.colors.hecto.green[500],
                            color: 'white',
                        }}>
                            <Typography variant="subtitle2">
                                theme.brand.colors.hecto.green[500]
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: 1,
                            bgcolor: theme.brand.colors.test.green[500],
                            color: 'white',
                        }}>
                            <Typography variant="subtitle2">
                                theme.brand.colors.test.green[500]
                            </Typography>
                        </Box>

                        {/* Brand Color 패턴 테스트 */}
                        <Box sx={{
                            p: 1,
                            bgcolor: `${primaryColorGroup}.green.500`,
                            color: 'white',
                        }}>
                            <Typography variant="subtitle2">
                                {primaryColorGroup}.green.500
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: 1,
                            bgcolor: `${testColorGroup}.green.500`,
                            color: 'white',
                        }}>
                            <Typography variant="subtitle2">
                                {testColorGroup}.green.500
                            </Typography>
                        </Box>

                        {/* Material Color 패턴 테스트 */}
                        <Box sx={{
                            p: 1,
                            bgcolor: green[500],
                            color: 'white',
                        }}>
                            <Typography variant="subtitle2">
                                green[500]
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Typography */}
                <Box component="section" className="section" id="sectionTypography">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Typography
                    </Typography>
                    <Typography variant="h1">Heading 1</Typography>
                    <Typography variant="h2">Heading 2</Typography>
                    <Typography variant="h3">Heading 3</Typography>
                    <Typography variant="h4">Heading 4</Typography>
                    <Typography variant="h5">Heading 5</Typography>
                    <Typography variant="h6">Heading 6</Typography>
                    <Typography variant="subtitle1">Subtitle 1</Typography>
                    <Typography variant="subtitle2">Subtitle 2</Typography>
                    <Typography variant="body1">Body 1</Typography>
                    <Typography variant="body2">Body 2</Typography>
                    <Typography variant="caption">Caption</Typography>{` `}
                    <Typography variant="overline">Overline</Typography>
                    <Typography variant="inherit">Inherit</Typography>
                </Box>

                {/* Buttons */}
                <Box component="section" className="section" id="sectionButtons">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Buttons
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Button variant="contained">Contained</Button>
                        <Button variant="outlined">Outlined</Button>
                        <Button variant="text">Text</Button>
                        <Button variant="contained" disabled>Disabled</Button>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Button variant="contained" color="primary">Primary</Button>
                        <Button variant="contained" color="secondary">Secondary</Button>
                        <Button variant="contained" color="success">Success</Button>
                        <Button variant="contained" color="error">Error</Button>
                        <Button variant="contained" color="warning">Warning</Button>
                        <Button variant="contained" color="info">Info</Button>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button variant="contained" startIcon={<Add />}>Add</Button>
                        <Button variant="outlined" endIcon={<Settings />}>Settings</Button>
                        <IconButton color="primary"><Add fontSize="inherit" /></IconButton>
                        <IconButton color="secondary"><Settings fontSize="inherit" /></IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                        <Button variant="contained" size="small">Small</Button>
                        <Button variant="contained">Default(Medium)</Button>
                        <Button variant="contained" size="large">Large</Button>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton color="primary" size="small"><Add fontSize="inherit" /></IconButton>
                        <IconButton color="primary"><Add fontSize="inherit" /></IconButton>
                        <IconButton color="primary" size="large"><Add fontSize="inherit" /></IconButton>
                    </Stack>
                </Box>

                {/* Toggle Buttons */}
                <Box component="section" className="section" id="sectionToggleButtons">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Toggle Buttons
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        {(['small', 'medium', 'large'] as const).map((size) => {
                            const [value, setValue] = toggleSizeState[size];
                            return (
                                <ToggleButtonGroup
                                    key={size}
                                    size={size}
                                    value={value}
                                    exclusive
                                    onChange={(e, v) => v && setValue(v)}
                                >
                                    <ToggleButton value="left">{sizeToLabel[size]}</ToggleButton>
                                    <ToggleButton value="center">{sizeToLabel[size]}</ToggleButton>
                                    <ToggleButton value="right">{sizeToLabel[size]}</ToggleButton>
                                </ToggleButtonGroup>
                            );
                        })}
                    </Box>
                </Box>

                {/* Chips & Avatars */}
                <Box component="section" className="section" id="sectionChipsAvatars">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Chips & Avatars
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Chip label="Default" />
                        <Chip label="Primary" color="primary" />
                        <Chip label="Secondary" color="secondary" />
                        <Chip label="Success" color="success" />
                        <Chip label="Error" color="error" />
                        <Chip label="Warning" color="warning" />
                        <Chip label="Info" color="info" />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Chip label="Filled" variant="filled" />
                        <Chip label="Outlined" variant="outlined" />
                        <Chip label="Deletable" onDelete={() => { }} />
                        <Chip label="With Icon" icon={<Star />} />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Chip label="Small" size="small" />
                        <Chip label="Default(Medium)" />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Avatar>A</Avatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>B</Avatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>C</Avatar>
                        <Avatar><Person /></Avatar>
                    </Stack>
                </Box>

                {/* Form */}
                <Box component="section" className="section" id="sectionFormControls">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Form
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                label="Standard"
                                variant="standard"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Filled"
                                variant="filled"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Outlined"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="With Helper Text"
                                helperText="Some important text"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="With Icon"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="basicSelectLabel">Select</InputLabel>
                                <Select
                                    labelId="basicSelectLabel"
                                    value={selectValue}
                                    label="Select"
                                    onChange={(e) => setSelectValue(e.target.value)}
                                >
                                    <MenuItem value="option1">Option 1</MenuItem>
                                    <MenuItem value="option2">Option 2</MenuItem>
                                    <MenuItem value="option3">Option 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                    />
                                }
                                label="Checkbox"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={switchChecked}
                                        onChange={(e) => setSwitchChecked(e.target.checked)}
                                    />
                                }
                                label="Switch"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <FormLabel>Radio Group</FormLabel>
                                <RadioGroup
                                    value={radioValue}
                                    onChange={(e) => setRadioValue(e.target.value)}
                                >
                                    <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                                    <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Form Sizes */}
                    <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Sizes
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                label="TextField Small"
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="TextField Medium"
                                size="medium"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="sizeSmallLabel">Select Small</InputLabel>
                                <Select
                                    labelId="sizeSmallLabel"
                                    value={selectValue}
                                    label="Select Small"
                                    onChange={(e) => setSelectValue(e.target.value)}
                                >
                                    <MenuItem value="option1">Option 1</MenuItem>
                                    <MenuItem value="option2">Option 2</MenuItem>
                                    <MenuItem value="option3">Option 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size="medium">
                                <InputLabel id="sizeMediumLabel">Select Medium</InputLabel>
                                <Select
                                    labelId="sizeMediumLabel"
                                    value={selectValue}
                                    label="Select Medium"
                                    onChange={(e) => setSelectValue(e.target.value)}
                                >
                                    <MenuItem value="option1">Option 1</MenuItem>
                                    <MenuItem value="option2">Option 2</MenuItem>
                                    <MenuItem value="option3">Option 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                    />
                                }
                                label="Checkbox (Small)"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                    />
                                }
                                label="Checkbox (Medium)"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        checked={switchChecked}
                                        onChange={(e) => setSwitchChecked(e.target.checked)}
                                    />
                                }
                                label="Switch (Small)"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={switchChecked}
                                        onChange={(e) => setSwitchChecked(e.target.checked)}
                                    />
                                }
                                label="Switch (Medium)"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl>
                                <FormLabel>Radio Group (Small vs Medium)</FormLabel>
                                <RadioGroup
                                    row
                                    value={radioValue}
                                    onChange={(e) => setRadioValue(e.target.value)}
                                >
                                    <FormControlLabel value="option1" control={<Radio size="small" />} label="Small" />
                                    <FormControlLabel value="option2" control={<Radio />} label="Medium" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                {/* Cards */}
                <Box component="section" className="section" id="sectionCards">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Cards
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Card Title
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    This is a simple card with some content.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Action</Button>
                                <Button size="small">Another Action</Button>
                            </CardActions>
                        </Card>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Card with Icon
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}><Work /></Avatar>
                                    <Typography variant="body2">Work Item</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>

                {/* Tables */}
                <Box component="section" className="section" id="sectionTables">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Tables
                    </Typography>


                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                            <Typography component="h3" variant="h6" gutterBottom>
                                Default (Medium)
                            </Typography>
                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Item 1</TableCell>
                                            <TableCell>
                                                <Chip label="Active" color="success" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Edit /></IconButton>
                                                <IconButton size="small"><Delete /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Item 2</TableCell>
                                            <TableCell>
                                                <Chip label="Inactive" color="default" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Edit /></IconButton>
                                                <IconButton size="small"><Delete /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box>
                            <Typography component="h3" variant="h6" gutterBottom>
                                Small
                            </Typography>
                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Item 1</TableCell>
                                            <TableCell>
                                                <Chip label="Active" color="success" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Edit /></IconButton>
                                                <IconButton size="small"><Delete /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Item 2</TableCell>
                                            <TableCell>
                                                <Chip label="Inactive" color="default" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Edit /></IconButton>
                                                <IconButton size="small"><Delete /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>

                {/* Lists */}
                <Box component="section" className="section" id="sectionLists">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Lists
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Box>
                            <Typography component="h3" variant="h6" gutterBottom>
                                Default
                            </Typography>
                            <Paper sx={{ maxWidth: 400 }}>
                                <List>
                                    <ListItem>
                                        <ListItemIcon><Home /></ListItemIcon>
                                        <ListItemText primary="Home" secondary="Main page" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><Work /></ListItemIcon>
                                        <ListItemText primary="Work" secondary="Work items" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemIcon><School /></ListItemIcon>
                                        <ListItemText primary="Education" secondary="Learning materials" />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                        <Box>
                            <Typography component="h3" variant="h6" gutterBottom>
                                Dense
                            </Typography>
                            <Paper sx={{ maxWidth: 400 }}>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon><Home /></ListItemIcon>
                                        <ListItemText primary="Home" secondary="Main page" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><Work /></ListItemIcon>
                                        <ListItemText primary="Work" secondary="Work items" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemIcon><School /></ListItemIcon>
                                        <ListItemText primary="Education" secondary="Learning materials" />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                    </Stack>
                </Box>

                {/* Alerts */}
                <Box component="section" className="section" id="sectionAlerts">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Alerts
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Alert severity="error">This is an error alert!</Alert>
                        </Grid>
                        <Grid item xs={3}>
                            <Alert severity="warning">This is a warning alert!</Alert>
                        </Grid>
                        <Grid item xs={3}>
                            <Alert severity="info">This is an info alert!</Alert>
                        </Grid>
                        <Grid item xs={3}>
                            <Alert severity="success">This is a success alert!</Alert>
                        </Grid>
                        <Grid item xs={3}>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                This is an error alert with title!
                            </Alert>
                        </Grid>
                    </Grid>
                </Box>

                {/* Dialogs & Menus */}
                <Box component="section" className="section" id="sectionDialogs">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Dialogs & Menus
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" onClick={() => setDialogOpen(true)}>
                            Open Dialog
                        </Button>
                        <Button variant="outlined" onClick={handleMenuOpen}>
                            Open Menu
                        </Button>
                    </Stack>

                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogContent>
                            <Typography>
                                This is a dialog content. You can put any content here.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={() => setDialogOpen(false)} autoFocus>OK</Button>
                        </DialogActions>
                    </Dialog>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItemComponent onClick={handleMenuClose}>
                            <ListItemIconComponent><Edit /></ListItemIconComponent>
                            <ListItemTextComponent>Edit</ListItemTextComponent>
                        </MenuItemComponent>
                        <MenuItemComponent onClick={handleMenuClose}>
                            <ListItemIconComponent><Share /></ListItemIconComponent>
                            <ListItemTextComponent>Share</ListItemTextComponent>
                        </MenuItemComponent>
                        <MenuItemComponent onClick={handleMenuClose}>
                            <ListItemIconComponent><Delete /></ListItemIconComponent>
                            <ListItemTextComponent>Delete</ListItemTextComponent>
                        </MenuItemComponent>
                    </Menu>
                </Box>

                {/* Snackbar */}
                <Box component="section" className="section" id="sectionSnackbar">
                    <Typography component="h2" variant="h5" gutterBottom>
                        Snackbar
                    </Typography>
                    <Button variant="contained" onClick={() => setSnackbarOpen(true)}>
                        Show Snackbar
                    </Button>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={() => setSnackbarOpen(false)}
                        message="This is a snackbar message"
                    />
                </Box>
            </Box>
        </Box>
    );
};


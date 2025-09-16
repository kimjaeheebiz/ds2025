import React from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Switch,
    Radio,
    RadioGroup,
    FormControl,
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
    Tooltip,
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
    InputAdornment,
    Menu,
    MenuItem as MenuItemComponent,
    ListItemIcon as ListItemIconComponent,
    ListItemText as ListItemTextComponent,
} from '@mui/material';
import {
    Add,
    Search,
    Star,
    StarBorder,
    Settings,
    MoreVert,
    Person,
    Build,
    PlayArrow,
    Delete,
    Edit,
    Share,
    Download,
    Upload,
    Home,
    Work,
    School,
    Favorite,
    FavoriteBorder,
} from '@mui/icons-material';

export const Components = () => {
    const [checked, setChecked] = React.useState(false);
    const [switchChecked, setSwitchChecked] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState('option1');
    const [selectValue, setSelectValue] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [toggleValue, setToggleValue] = React.useState('left');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                MUI 컴포넌트 참고용 페이지입니다.
            </Typography>

            {/* Buttons */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Buttons
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Button variant="contained">Contained</Button>
                    <Button variant="outlined">Outlined</Button>
                    <Button variant="text">Text</Button>
                    <Button variant="contained" disabled>Disabled</Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Button variant="contained" color="primary">Primary</Button>
                    <Button variant="contained" color="secondary">Secondary</Button>
                    <Button variant="contained" color="success">Success</Button>
                    <Button variant="contained" color="error">Error</Button>
                    <Button variant="contained" color="warning">Warning</Button>
                    <Button variant="contained" color="info">Info</Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<Add />}>Add</Button>
                    <Button variant="outlined" endIcon={<Settings />}>Settings</Button>
                    <IconButton color="primary"><Add /></IconButton>
                    <IconButton color="secondary"><Settings /></IconButton>
                </Box>
            </Box>

            {/* Form Controls */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Form Controls
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                    <TextField
                        label="Standard"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Filled"
                        variant="filled"
                        fullWidth
                    />
                    <TextField
                        label="Standard"
                        variant="standard"
                        fullWidth
                    />
                    <TextField
                        label="With Helper Text"
                        helperText="Some important text"
                        fullWidth
                    />
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                            />
                        }
                        label="Checkbox"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={switchChecked}
                                onChange={(e) => setSwitchChecked(e.target.checked)}
                            />
                        }
                        label="Switch"
                    />
                    <FormControl>
                        <FormLabel>Radio Group</FormLabel>
                        <RadioGroup
                            value={radioValue}
                            onChange={(e) => setRadioValue(e.target.value)}
                        >
                            <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                            <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl fullWidth>
                        <FormLabel>Select</FormLabel>
                        <Select
                            value={selectValue}
                            onChange={(e) => setSelectValue(e.target.value)}
                        >
                            <MenuItem value="option1">Option 1</MenuItem>
                            <MenuItem value="option2">Option 2</MenuItem>
                            <MenuItem value="option3">Option 3</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Chips & Avatars */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Chips & Avatars
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label="Default" />
                    <Chip label="Primary" color="primary" />
                    <Chip label="Secondary" color="secondary" />
                    <Chip label="Success" color="success" />
                    <Chip label="Error" color="error" />
                    <Chip label="Warning" color="warning" />
                    <Chip label="Info" color="info" />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label="Filled" variant="filled" />
                    <Chip label="Outlined" variant="outlined" />
                    <Chip label="Deletable" onDelete={() => { }} />
                    <Chip label="With Icon" icon={<Star />} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Avatar>A</Avatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>B</Avatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>C</Avatar>
                    <Avatar><Person /></Avatar>
                </Box>
            </Box>

            {/* Cards */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Cards
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                </Box>
            </Box>

            {/* Tables */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Tables
                </Typography>
                <TableContainer component={Paper}>
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

            {/* Toggle Buttons */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Toggle Buttons
                </Typography>
                <ToggleButtonGroup
                    value={toggleValue}
                    exclusive
                    onChange={(e, newValue) => setToggleValue(newValue)}
                >
                    <ToggleButton value="left">Left</ToggleButton>
                    <ToggleButton value="center">Center</ToggleButton>
                    <ToggleButton value="right">Right</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Lists */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Lists
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

            {/* Alerts */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Alerts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="error">This is an error alert!</Alert>
                    <Alert severity="warning">This is a warning alert!</Alert>
                    <Alert severity="info">This is an info alert!</Alert>
                    <Alert severity="success">This is a success alert!</Alert>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        This is an error alert with title!
                    </Alert>
                </Box>
            </Box>

            {/* Dialogs & Menus */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Dialogs & Menus
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>
                        Open Dialog
                    </Button>
                    <Button variant="outlined" onClick={handleMenuOpen}>
                        Open Menu
                    </Button>
                </Box>

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
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
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
    );
};


import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Grid, Card, CardContent, CardActions, styled, CssBaseline } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import { useAddMasterProcedureMutation, useCreateTimeSlotsMutation, useDeleteMasterProcedureMutation, useGetAllMasterProceduresQuery, useUpdateMasterProcedureMutation } from '../redux';
import useInput from '../hooks/UseInput';
import { createMasterProcedureSchema, updateMasterProcedureSchema } from '../schemas/schemas';

const ProcedureCard = styled(Card)(({ theme }) => ({
  background: '#fff',
  borderRadius: '15px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
  padding: theme.spacing(2),
}));

const FancyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '25px',
  border: `2px solid ${theme.palette.secondary.main}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#fff',
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    transform: 'scale(1.05)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  color: theme.palette.primary.main,
  fontFamily: 'Playfair Display, serif',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '25px',
  border: `2px solid ${theme.palette.primary.main}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    transform: 'scale(1.05)',
  },
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const MasterProcedures = () => {
  const { id } = useParams<{ id: string }>();
  const { data, refetch, isLoading, error } = useGetAllMasterProceduresQuery(id!);
  const [createTimeSlots] = useCreateTimeSlotsMutation();
  const [updateMasterProcedure] = useUpdateMasterProcedureMutation();
  const [createMasterProcedure] = useAddMasterProcedureMutation();
  const [deleteMasterProcedure] = useDeleteMasterProcedureMutation();

  const [procedureId, setProcedureId] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [createProcedureDialogOpen, setCreateProcedureDialogOpen] = useState(false);
  const [timeSlotDialogOpen, setTimeSlotDialogOpen] = useState(false);

  const handleCreateTimeSlot = async () => {
    if (!procedureId || !date || !startTime || !endTime || slotDuration <= 0) {
      toast.error('Please provide all required details.');
      return;
    }

    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedStartTime = dayjs(startTime).format('HH:mm:ss');
    const formattedEndTime = dayjs(endTime).format('HH:mm:ss');

    try {
      await createTimeSlots({
        masterId: id!,
        procedureId,
        date: formattedDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        slotDuration,
      }).unwrap();
      toast.success('Time slots created successfully');
      setDate(null);
      setStartTime(null);
      setEndTime(null);
      setSlotDuration(30);
      setProcedureId('');
      setTimeSlotDialogOpen(false);
    } catch {
      toast.error('Error creating time slots');
    }
  };

  const handleUpdateMasterProcedure = async () => {
    if (!updateValues.price || Number(updateValues.price) <= 0) {
      toast.error('Please enter a valid price.');
      return;
    }

    try {
      await updateMasterProcedure({
        masterId: id!,
        procedureId,
        price: Number(updateValues.price),
      }).unwrap();
      refetch();
      toast.success('Price updated successfully');
      setPriceDialogOpen(false);
    } catch {
      toast.error('Error updating price');
    }
  };

  const { values: updateValues, errors: updateErrors, touched: updateTouched, handleChange: updateHandleChange, handleBlur: updateHandleBlur, handleSubmit: updateHandleSubmit } = useInput(
    updateMasterProcedureSchema,
    { price: '' },
    handleUpdateMasterProcedure
  );

  const handleCreateMasterProcedure = async () => {
    try {
      await createMasterProcedure({
        masterId: id!,
        procedureName: createValues.procedureName,
        price: Number(createValues.price),
        duration: Number(createValues.duration),
      }).unwrap();
      toast.success('New procedure created successfully');
      refetch();
      setCreateProcedureDialogOpen(false);
    } catch {
      toast.error('Error creating procedure');
    }
  };

  const { values: createValues, errors: createErrors, touched: createTouched, handleChange: createHandleChange, handleBlur: createHandleBlur, handleSubmit: createHandleSubmit } = useInput(
    createMasterProcedureSchema,
    { procedureName: '', price: 0, duration: 0 },
    handleCreateMasterProcedure
  );

  const handleDeleteMasterProcedure = async (procedureId: string) => {
    try {
      await deleteMasterProcedure({
        masterId: id!,
        procedureId,
      }).unwrap();
      toast.success('Procedure deleted successfully');
      refetch();
    } catch {
      toast.error('Error deleting procedure');
    }
  };

  if (isLoading) {
    return <Typography align="center" sx={{ mt: 4, fontStyle: 'italic' }}>Loading procedures...</Typography>;
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 4 }}>Error fetching procedures</Typography>;
  }

  return (
    <Box sx={{ py: 6, backgroundColor: '#f9f6f2', minHeight: '100vh' }}>
      <ToastContainer />
      <CssBaseline />
      <HeaderTypography variant="h3" sx={{ mb: 4 }}>
        Your Procedures
      </HeaderTypography>
      <Grid container spacing={4} padding={{ xs: 2, md: 4 }}>
        {data?.map((procedure) => (
          <Grid item xs={12} sm={6} md={4} key={procedure.id}>
            <ProcedureCard elevation={0}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#8d5524' }}>
                  {procedure.procedure.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${procedure.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1, pb: 2 }}>
                <FancyButton onClick={() => { setProcedureId(procedure.procedure.id); setTimeSlotDialogOpen(true); }}>
                  Set Time
                </FancyButton>
                <FancyButton onClick={() => { setProcedureId(procedure.procedure.id); setPriceDialogOpen(true); }}>
                  Change Price
                </FancyButton>
                <SecondaryButton onClick={() => handleDeleteMasterProcedure(procedure.procedure.id)}>
                  Delete
                </SecondaryButton>
              </CardActions>
            </ProcedureCard>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <FancyButton onClick={() => setCreateProcedureDialogOpen(true)}>Add New Procedure</FancyButton>
      </Box>

      <Dialog open={timeSlotDialogOpen} onClose={() => setTimeSlotDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#8d5524' }}>Create Time Slots</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', sx: { '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } } } }}
            />
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', sx: { '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } } } }}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', sx: { '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } } } }}
            />
            <TextField
              label="Slot Duration (minutes)"
              type="number"
              value={slotDuration}
              onChange={(e) => setSlotDuration(Number(e.target.value))}
              fullWidth
              margin="dense"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setTimeSlotDialogOpen(false)}>Cancel</SecondaryButton>
          <FancyButton onClick={handleCreateTimeSlot}>Submit</FancyButton>
        </DialogActions>
      </Dialog>

      <Dialog open={priceDialogOpen} onClose={() => setPriceDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#8d5524' }}>Update Price</DialogTitle>
        <DialogContent>
          <TextField
            label="New Price ($)"
            type="number"
            fullWidth
            name="price"
            value={updateValues.price}
            onChange={updateHandleChange}
            onBlur={updateHandleBlur}
            error={updateTouched.price && Boolean(updateErrors.price)}
            helperText={updateTouched.price && typeof updateErrors.price === 'string' ? updateErrors.price : ''}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } }}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setPriceDialogOpen(false)}>Cancel</SecondaryButton>
          <FancyButton onClick={updateHandleSubmit}>Update</FancyButton>
        </DialogActions>
      </Dialog>

      <Dialog open={createProcedureDialogOpen} onClose={() => setCreateProcedureDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display, serif', color: '#8d5524' }}>Create Procedure</DialogTitle>
        <DialogContent>
          <TextField
            label="Procedure Name"
            name="procedureName"
            value={createValues.procedureName}
            onChange={createHandleChange}
            onBlur={createHandleBlur}
            error={createTouched.procedureName && Boolean(createErrors.procedureName)}
            helperText={createTouched.procedureName && typeof createErrors.procedureName === 'string' ? createErrors.procedureName : ''}
            fullWidth
            margin="dense"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } }}
          />
          <TextField
            label="Price ($)"
            name="price"
            type="number"
            value={createValues.price}
            onChange={createHandleChange}
            onBlur={createHandleBlur}
            error={createTouched.price && Boolean(createErrors.price)}
            helperText={createTouched.price && typeof createErrors.price === 'string' ? createErrors.price : ''}
            fullWidth
            margin="dense"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } }}
          />
          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={createValues.duration}
            onChange={createHandleChange}
            onBlur={createHandleBlur}
            error={createTouched.duration && Boolean(createErrors.duration)}
            helperText={createTouched.duration && typeof createErrors.duration === 'string' ? createErrors.duration : ''}
            fullWidth
            margin="dense"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#f06292' }, '&.Mui-focused fieldset': { borderColor: '#8d5524' } } }}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setCreateProcedureDialogOpen(false)}>Cancel</SecondaryButton>
          <FancyButton onClick={createHandleSubmit}>Create</FancyButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterProcedures;
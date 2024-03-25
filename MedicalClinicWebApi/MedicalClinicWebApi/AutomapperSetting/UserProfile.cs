using AutoMapper;
using MedicalClinicWebApi.Model.Models;
using MedicalClinicWebApi.Model.ViewModels.Patient;
using MedicalClinicWebApi.Model.ViewModels.User;

namespace MedicalClinicWebApi.AutomapperSetting
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            // User model map
            CreateMap<User, UserViewModel>()
                .ForMember(d => d.UserTypeName, s => s.MapFrom(m => m.UserType.Name));
            CreateMap<UserViewModel, User>();

            CreateMap<User, UserCreateViewModel>();
            CreateMap<UserCreateViewModel, User>();

            CreateMap<User, UserUpdateViewModel>();
            CreateMap<UserUpdateViewModel, User>();

            // Patient model map
            CreateMap<Patient, PatientCreateModel>();
            CreateMap<PatientCreateModel, Patient>();

            CreateMap<Patient, PatientViewModel>()
                .ForMember(d => d.DoctroName, s => s.MapFrom(m => (m.User.FirstName + " " + m.User.LastName)));
            CreateMap<PatientViewModel, Patient>();

            CreateMap<Patient, PatientEditModel>();
            CreateMap<PatientEditModel, Patient>();
        }
    }
}
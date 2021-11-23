import sys
from django.utils import timezone
from datetime import datetime
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
# Custom
from .models import Seat, Mass, Language, Registration
from utils.constants import *
from utils.messages import *
from .messages import *


# NAME
# getRegistrationByUserCode
# PARAMETERS
# ruser: Registration user
# code: registration_confirm_code
# DESCRIPTIONS
# Get registration by ID and confirm code
# OUPUT
# aboutus: Aboutus


def getRegistrationByUserCode(ruser, code):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: ""
    }
    try:
        regis = Registration.objects.get(
            registration_user=code, registration_confirm_code=code)
        result[RESULT] = regis
        return result
    except:
        print("Register-controller-getRegistrationByIDCode: ",
              sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result

# NAME
# getRegistrationByStatusAndUser
# PARAMETERS
# ruser: Registration user
# code: registration_confirm_code
# DESCRIPTIONS
# Get registration by ID and confirm code
# OUPUT
# aboutus: Aboutus


def getRegistrationByStatusAndUser(ruser, code, status):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: ""
    }
    try:
        regis = Registration.objects.get(
            registration_user=code, registration_status=WAITING).order_by('registration_date')
        result[RESULT] = regis
        return result
    except:
        print("Register-controller-getRegistrationByIDCode: ",
              sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result

# NAME
# confirmRegistrationByUserCodeMass
# PARAMETERS
# ruser: Registration user
# code: registration_confirm_code
# DESCRIPTIONS
# Get registration by ID and confirm code
# OUPUT
# aboutus: Aboutus


def confirmRegistrationByUserCodeMass(ruser, code, mass):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: ""
    }
    try:
        registrations = Registration.objects.filter(
            registration_user=ruser, registration_confirm_code=code, registration_mass=mass)
        if len(registrations0) > 0:
            list_u_s = []
            for registration in registrations:
                registration.registration_status = PRESENTED
                registration.save()
                u_s = {
                    USERNAME: registration.registration_relationship.relationships_full_name,
                    SEATNUM: registration.registration_seat.seat_num
                }
                list_u_s.append(u_s)
            result[RESULT] = {
                TITLE: registration_mass.mass_title,
                USERS: list_u_s
            }
            result[CONTENT] = SYSTEM_GREETING_0001
        return result
    except:
        print("Register-controller-confirmRegistrationByUserCodeMass: ",
              sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result

# NAME
#
# PARAMETERS
#
#
# DESCRIPTIONS
#
# OUPUT
# aboutus: Aboutus


def checkIn(regis_id, regis_code):
    result = {
        STATUS: ERROR,
        CONTENT: {
            "user": {
                "username": "",
                "seat": ""
            },
            "message": "",
            "register": ""
        },
        RESULT: "",
    }
    try:
        registration = Registration.objects.get(
            pk=regis_id, registration_confirm_code=regis_code)
        if registration:
            mass = registration.registration_mass
            if registration.registration_status == APPROVED:
                registration.registration_status = PRESENTED
                registration.save()
                mass.mass_slots_attended += 1
                mass.save()
                user_name = registration.registration_user_name
                seat_num = registration.registration_seat.seat_no
                #profile = registration.registration_user.profile
                #profile.profile_presented_count += 1
                # profile.save()
                result[STATUS] = "ok"
                result[CONTENT]['message'] = MESS_REGISTER_CKIN_001
                result[CONTENT]['user'] = {
                    "username": user_name, "seat": seat_num}
                result[RESULT] = registration.registration_user
                result[STATUS] = OK
            elif registration.registration_status == PRESENTED:
                result[CONTENT]['message'] = MESS_REGISTER_CKIN_002
                result[STATUS] = PRESENTED
            elif registration.registration_status == WAITING:
                result[CONTENT]['message'] = MESS_REGISTER_CKIN_003
                result[STATUS] = WAITING
            elif registration.registration_status == DENY:
                result[CONTENT]['message'] = MESS_REGISTER_CKIN_004
                result[STATUS] = DENY
            else:  # Canceled
                result[CONTENT]['message'] = MESS_REGISTER_CKIN_007
                result[STATUS] = CANCEL
            register = {
                "title": mass.mass_title,
                "registered": mass.mass_slots_registered,
                "presented": mass.mass_slots_attended,
                "waiting": mass.mass_waiting
            }
            result[CONTENT]['register'] = register
        return result
    except:
        print("Register-controller-checkin: ", sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result


# NAME
# Cancel Registration
# PARAMETERS
# rid: Registration id
# code: registration_confirm_code
# DESCRIPTIONS
# Get registration by ID and confirm code
# OUPUT
# aboutus: Aboutus

def cancelRegistration(r_id, code):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: ""
    }
    try:
        registration = Registration.objects.get(
            pk=r_id, registration_confirm_code=code)
        if registration:
            if registration.registration_status == APPROVED:
                today = datetime.today()
                transfered = False
                if today.weekday() >= THURDAY and today.weekday() < SATURDAY:      # tranfer it to waiting people
                    mass = registration.registration_mass
                    w_registration = Registration.objects.filter(
                        registration_mass=mass, registration_status=WAITING).order_by('registration_date').first()
                    if w_registration:
                        w_registration.registration_status = APPROVED
                        w_registration.registration_seat = registration.registration_seat
                        w_registration.save()
                        regis_mass = w_registration.registration_mass
                        regis_mass.mass_waiting -= 1
                        regis_mass.save()
                        transfered = True
                        from kanri.controller import send_approved_email
                        email = w_registration.registration_user.email
                        user = w_registration.registration_user
                        bid = w_registration.id
                        cd = w_registration.registration_confirm_code
                        massname = w_registration.registration_mass.mass_title
                        # Send email notice to user that their booking have approved
                        send_approved_email(user, email, bid, cd, massname)
                        # send_email_to(NOTICE_APPROVE,[w_registration.registration_user.email,],BLANK,BLANK)
                if not(transfered):
                    seat = registration.registration_seat
                    seat.seat_status = AVAILABEL
                    seat.save()
                    regis_mass = registration.registration_mass
                    regis_mass.mass_slots_registered -= 1
                    regis_mass.save()
            elif registration.registration_status == WAITING:    #
                regis_mass = registration.registration_mass
                regis_mass.mass_waiting -= 1
                regis_mass.save()
            registration.registration_status = CANCEL
            registration.save()
            result[CONTENT] = MESS_REGISTER_0001
            return result
        else:
            result[STATUS] = ERROR
            result[CONTENT] = MESS_REGISTER_0002
        return result
    except:
        print("Register-controller-cancelRegistration : ", sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result


def updateConfirmStatus(uid, rdcode, r_id, code):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: ""
    }
    try:
        registration = Registration.objects.get(
            pk=r_id, registration_confirm_code=code)
        if registration:
            if registration.registration_status == APPROVED:
                if registration.registration_user.id == int(uid) and registration.registration_user.profile.profile_code == rdcode:
                    registration.registration_confirm_status = CONFIRMED
                    registration.save()
                    result[CONTENT] = MESS_REGISTER_0012
                    return result
            elif registration.registration_status == CANCEL:
                result[STATUS] = WARNING
                result[CONTENT] = MESS_REGISTER_CKIN_007
                return result
            elif registration.registration_status == DENY:
                result[STATUS] = WARNING
                result[CONTENT] = MESS_REGISTER_CKIN_004
                return result
        else:
            result[STATUS] = ERROR
            result[CONTENT] = MESS_REGISTER_0013
        return result
    except:
        print("Register-controller-cancelRegistration : ", sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result

# NAME
#
# PARAMETERS
#
#
# DESCRIPTIONS
# Check if user can register or cannot for VietNamese only
# OUPUT
# aboutus: Aboutus


def checkUserRegistered(p_user, p_relation, p_mass):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: BLANK
    }
    try:
        registrations = Registration.objects.filter(
            registration_user=p_user, registration_mass=p_mass)
        today = datetime.today()
        for registration in registrations:
            if registration:
                if registration.registration_status == APPROVED or registration.registration_status == WAITING:
                    result[STATUS] = ERROR
                    result[RESULT] = REGISTERED
                    result[CONTENT] = MESS_REGISTER_0003
                    return result
        if p_mass.mass_slots_registered >= p_mass.mass_slots:
            if today.weekday() == SUNDAY:
                if today.hour >= p_mass.mass_time.hour - MINUSHOUR:
                    result[RESULT] = WAITING
                    result[CONTENT] = MESS_REGISTER_0004
                    return result
        if p_mass.mass_language == VI:
            previous_week = str(int(p_mass.mass_date_ordinary)-1)
            last_mass = Mass.objects.filter(
                mass_date_ordinary=previous_week, mass_language=VI).order_by('-mass_date').first()
            lastregis = Registration.objects.filter(
                registration_user=p_user, registration_mass=last_mass).order_by('-registration_date').first()
            if lastregis:
                if lastregis.registration_status == PRESENTED or lastregis.registration_status == ABSENTED or lastregis.registration_status == APPROVED:
                    mass_week = lastregis.registration_mass.mass_date_ordinary
                    if previous_week == mass_week:
                        if today.weekday() < THURDAY:
                            result[RESULT] = WAITING
                            result[CONTENT] = MESS_REGISTER_0005
                            return result

            next_week = str(int(p_mass.mass_date_ordinary)+1)
            next_mass = Mass.objects.filter(
                mass_date_ordinary=next_week, mass_language=VI).order_by('-mass_date').first()
            next_regis = Registration.objects.filter(
                registration_user=p_user, registration_mass=next_mass).order_by('-registration_date').first()
            if next_regis:
                if next_regis.registration_status == PRESENTED or next_regis.registration_status == ABSENTED or next_regis.registration_status == APPROVED:
                    mass_week = next_regis.registration_mass.mass_date_ordinary
                    if next_week == mass_week:
                        if today.weekday() < THURDAY:
                            result[RESULT] = WAITING
                            result[CONTENT] = MESS_REGISTER_0005
                            return result
        return result
    except:
        print("Register-controller-: ", sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result


# NAME
#
# PARAMETERS
#
#
# DESCRIPTIONS
#
# OUPUT
#

def getNextMassesByChurch(p_church, p_status):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: ""
    }
    try:
        from kanri.models import Mass
        masses = Mass.objects.filter(mass_church=p_church, mass_active=p_status).order_by(
            "mass_time")  # mass_date__gte = timezone.now()
        result[RESULT] = masses
        return result
    except:
        print("Register-controller-: ", sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result
# NAME
#
# PARAMETERS
#
#
# DESCRIPTIONS
#
# OUPUT
#


def getActiveMasses(p_status):
    result = {
        STATUS: OK,
        CONTENT: BLANK,
        RESULT: ""
    }
    try:
        # mass_date__gte = timezone.now()
        masses = Mass.objects.filter(mass_active=p_status)
        result[RESULT] = masses
        return result
    except:
        print("Register-controller-: ", sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result
#

# NAME
#
# PARAMETERS
#
#
# DESCRIPTIONS
#
# OUPUT
# aboutus: Aboutus


def df():
    try:
        result = {
            STATUS: OK,
            CONTENT: BLANK,
            RESULT: ""
        }
        return result
    except:
        print("Register-controller-: ", sys.exc_info()[0])
        result[STATUS] = ERROR
        result[CONTENT] = SYSTEM_ERROR_0001
        return result

#

###


def get_seat_for_50(mass_schedule):
    seat = Seat.objects.filter(seat_type=SEAT_50, seat_mass_schedule=mass_schedule,
                               seat_status=AVAILABEL).order_by('seat_no').first()
    return seat


def get_seat_for_32(mass_schedule):
    seat = Seat.objects.filter(seat_type=SEAT_32, seat_mass_schedule=mass_schedule,
                               seat_status=AVAILABEL).order_by('seat_no').first()
    return seat


def get_seat_for_10(mass_schedule):
    seat = Seat.objects.filter(seat_type=SEAT_20, seat_mass_schedule=mass_schedule,
                               seat_status=AVAILABEL).order_by('seat_no').first()
    return seat


def get_seat_for_priority(mass_schedule):
    seat = Seat.objects.filter(seat_type=SEAT_PRI, seat_mass_schedule=mass_schedule,
                               seat_status=AVAILABEL).order_by('seat_no').first()
    return seat


def get_seat_for_all(mass_schedule):
    seat = get_seat_for_priority(mass_schedule)
    if seat:
        return seat
    else:
        seat = Seat.objects.filter(
            seat_mass_schedule=mass_schedule, seat_status=AVAILABEL).order_by('seat_no').first()
        return seat

# get set no for user


def returnSeat(result, seat):
    result[STATUS] = OK
    result[SEAT] = seat
    seat.seat_status = TAKEN
    seat.save()
    return result


def getSeatNo(userage, mass_schedule, priority):
    #seat = Seat.objects.get(pk=0)
    result = {
        STATUS: FULL,
        SEAT: ""
    }
    if priority == NOTPRIORITY:
        if userage >= int(SEAT_50):
            seat = get_seat_for_50(mass_schedule)
            if seat:
                return returnSeat(result, seat)
            else:
                seat = get_seat_for_32(mass_schedule)
                if seat:
                    return returnSeat(result, seat)
        elif userage >= int(SEAT_32):
            seat = get_seat_for_32(mass_schedule)
            if seat:
                return returnSeat(result, seat)
            else:
                seat = get_seat_for_50(mass_schedule)
                if seat:
                    return returnSeat(result, seat)
        elif userage >= 10:
            seat = get_seat_for_priority(mass_schedule)
            if seat:
                return returnSeat(result, seat)
            else:
                seat = get_seat_for_10(mass_schedule)
                if seat:
                    return returnSeat(result, seat)
                else:
                    seat = get_seat_for_32(mass_schedule)
                    if seat:
                        return returnSeat(result, seat)
                    else:
                        seat = get_seat_for_50(mass_schedule)
                        if seat:
                            return returnSeat(result, seat)
    else:
        seat = get_seat_for_priority(mass_schedule)
        if seat:
            return returnSeat(result, seat)
    seat = get_seat_for_all(mass_schedule)
    if seat:
        return returnSeat(result, seat)
    return result


def getSeatNoForGroup(mass_schedule, num_seat):
    seats = Seat.objects.filter(
        seat_mass_schedule=mass_schedule, seat_status=AVAILABEL).order_by('seat_no')[:num_seat]
    return seats


def singleRegister(mass_id, user_condi, user):
    #print("eventid: "+event_id)
    result = {
        STATUS: ERROR,
        REDIRECT: BLANK,
        CONTENT: BLANK,
        RESULT: BLANK
    }
    from adminapp.models import Mass
    mass = Mass.objects.get(pk=mass_id)
    today = datetime.today()
    if today.weekday() == SUNDAY:
        if today.hour < mass.mass_time.hour - MINUSHOUR:
            if mass.mass_slots_registered >= mass.mass_slots:
                result[CONTENT] = SYSTEM_ERROR_0002
                # result[REDIRECT]=REGISTER_HOME
                #messages.warning(request, SYSTEM_ERROR_0002)
                return result

    # Save user profile update tempturate self checked
    # print(user.username)
    users_profile = user.userprofile
    users_profile.profile_health_status = user_condi
    users_profile.profile_last_update_time = timezone.now()
    users_profile.save()
    #print("User profile saved")

    # Check if user have registered for this Mass (or previous Mass in VietNamese)
    check_result = checkUserRegistered(user, None, mass)
    if check_result[RESULT] == REGISTERED or check_result[STATUS] == ERROR:
        result[CONTENT] = check_result[CONTENT]
        # result[REDIRECT]=REGISTER_MYRE
        return result
        # messages.warning(request,check_result[CONTENT])
        # return redirect(REGISTER_MYRE)

    # Save Registration
    from adminapp.models import Registration
    registration = Registration(registration_user=user, registration_mass=mass,
                                registration_user_name=users_profile.profile_full_name)
    random_code = get_random_string(length=24, allowed_chars=CODERANGE)
    registration.registration_confirm_code = random_code
    registration.save()
    registration.registration_code = HOST_NAME+"register/cfmatt/?"+USER_ID+"=" + \
        str(user.pk)+"&"+BOOKING_ID+"="+str(registration.pk) + \
        "&"+MASS_ID+"="+str(mass_id)+"&"+CODE+"="+random_code
    registration.save()
    # print(booking.booking_code)
    if check_result[RESULT] == WAITING or mass.mass_slots_registered >= mass.mass_slots:
        mass.mass_waiting += 1
        mass.save()
        print("registration watting..")
        result[CONTENT] = check_result[CONTENT]
        result["object"] = registration
        result[REDIRECT] = REGISTER_MYRE
        return result
    mass_schedule = mass.mass_schedule
    seatContent = getSeatNo(users_profile.profile_age,
                            mass_schedule, NOTPRIORITY)
    # minus 1 slot
    if seatContent[STATUS] == OK:  # registration OK..
        mass.mass_slots_registered += 1
        mass.mass_total_registered += 1
        mass.save()
        registration.registration_status = APPROVED   # Mean that was accecpted
        if today.weekday() >= SATURDAY:               # Change here to a day before the Mass
            registration.registration_confirm_status = CONFIRMED
        seat = seatContent[SEAT]
        registration.registration_seat = seat
        registration.save()
        #seat.seat_status = TAKEN
        # seat.save()
        print("registration done")
        result[CONTENT] = MESS_REGISTER_0009 + mass.mass_date_ordinary
        # result[REDIRECT]=REGISTER_MYRE
        result[STATUS] = OK
        users_profile.profile_registered_count += 1
        users_profile.save()
        result[RESULT] = registration
        return result
    elif seatContent[STATUS] == FULL:  # registration watting..
        #mess_out = MESS_REGISTER_0010
        #messages.warning(request, mess_out)
        # return redirect(REGISTER_MYRE)
        result[CONTENT] = MESS_REGISTER_0010
        result[STATUS] = WAITING
        #result[REDIRECT]= REGISTER_MYRE
        result[RESULT] = registration
        return result


def multipleRegister(mass_id, user_condi, user, list_u):
    #print("eventid: "+event_id)
    result = {
        STATUS: ERROR,
        REDIRECT: BLANK,
        CONTENT: BLANK
    }
    from kanri.models import Mass
    mass = Mass.objects.get(pk=mass_id)
    today = datetime.today()
    if today.weekday() == SUNDAY:
        if today.hour < mass.mass_time.hour - MINUSHOUR:
            if mass.mass_slots_registered >= mass.mass_slots:
                result[CONTENT] = SYSTEM_ERROR_0002
                result[REDIRECT] = REGISTER_HOME
                #messages.warning(request, SYSTEM_ERROR_0002)
                return result

    # Save user profile update tempturate self checked
    # print(user.username)
    users_profile = user.userprofile
    users_profile.profile_health_status = user_condi
    users_profile.profile_last_update_time = timezone.now()
    users_profile.save()
    #print("User profile saved")

    # Check if user have registered for this event (or previous Mass in VietNamese)
    check_result = checkUserRegistered(user, None, mass)
    if check_result[RESULT] == REGISTERED or check_result[STATUS] == ERROR:
        result[CONTENT] = check_result[CONTENT]
        result[REDIRECT] = REGISTER_MYRE
        return result
        # messages.warning(request,check_result[CONTENT])
        # return redirect(REGISTER_MYRE)
    # Save Registration
    from .models import Registration
    registration = Registration(registration_user=user, registration_mass=mass,
                                registration_user_name=users_profile.profile_full_name, registration_user_age=users_profile.profile_age)
    random_code = get_random_string(length=18, allowed_chars=CODERANGE)
    registration.registration_confirm_code = random_code
    registration.save()
    registration.registration_code = HOST_NAME+"register/cfmatt/?"+USER_ID+"=" + \
        str(user.pk)+"&"+BOOKING_ID+"="+str(registration.pk) + \
        "&"+MASS_ID+"="+str(mass_id)+"&"+CODE+"="+random_code
    registration.save()
    num_seat = 1
    list_regis = [registration]
    for user_re in list_u:
        registration = Registration(registration_user=user, registration_mass=mass,
                                    registration_user_name=user_re["uname"], registration_user_age=user_re["uage"])
        random_code = get_random_string(length=18, allowed_chars=CODERANGE)
        registration.registration_confirm_code = random_code
        registration.save()
        registration.registration_code = HOST_NAME+"register/cfmatt/?"+USER_ID+"=" + \
            str(user.pk)+"&"+BOOKING_ID+"="+str(registration.pk) + \
            "&"+MASS_ID+"="+str(mass_id)+"&"+CODE+"="+random_code
        registration.save()
        list_regis.append(registration)
        num_seat += 1
    #
    if check_result[RESULT] == WAITING:
        mass.mass_waiting += 1
        mass.save()
        print("registration watting..")
        result[CONTENT] = check_result[CONTENT]
        result[REDIRECT] = REGISTER_MYRE
        return result
    mass_schedule = mass.mass_schedule
    seats = getSeatNoForGroup(mass_schedule, num_seat)
    # minus 1 slot
    index = 0
    for seat in seats:
        registration = list_regis[index]
        registration.registration_status = APPROVED   # Mean that was accecpted
        registration.registration_seat = seat
        registration.save()
        seat.seat_status = TAKEN
        seat.save()
        mass.mass_slots_registered += 1
        mass.save()
        index += 1
    users_profile.profile_registered_count += index
    users_profile.save()
    print("registration done")
    result[CONTENT] = MESS_REGISTER_0009 + mass.mass_date_ordinary
    result[REDIRECT] = REGISTER_MYRE
    result[STATUS] = OK
    return result


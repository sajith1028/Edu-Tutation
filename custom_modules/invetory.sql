use akura;

create table item (
	itID int auto_increment primary key,
    description varchar(255),
    unit varchar(50),
    receivedQty int default 0,
    issuedQty int default 0,
    inStockQty int generated always as (receivedQty - issuedQty),
    remarks varchar(255)
);

create table received_item (
	rcitID int auto_increment primary key,
    itID int,
    qty int,
    date datetime default now(),
    remarks varchar(255),
    foreign key (itID) references item(itID) on delete cascade
);

create table issued_item (
	isitID int auto_increment primary key,
    itID int,
    qty int,
    date datetime default now(),
    remarks varchar(255),
    foreign key (itID) references item(itID) on delete cascade
);

create table issue_request (
	reqID int auto_increment primary key,
    itID int,
    subID varchar(20),
    qty int,
    date datetime default now(),
    accepted bool default false,
    pending bool default true,
    foreign key(itID) references item(itID) on delete cascade,
    foreign key(subID) references subject(subID)
);

delimiter $$
create trigger update_receivedQty
	after insert
    on received_item for each row
begin
	update item
	set receivedQty = (select sum(qty) from received_item where itID = new.itID)
	where itID = new.itID;
end$$

create trigger update_issued_item
	after insert
    on issued_item for each row
begin
	update item
    set issuedQty = (select sum(qty) from issued_item where itId = new.itID)
    where itID = new.itID;
end$$

create procedure accept_request (in reqID int, in remarks varchar(255))
begin
	declare _itID, _qty int;
	update issue_request
    set accepted = true, pending = false
    where issue_request.reqID=reqID;
    set _itID = (select itID from issue_request where issue_request.reqID=reqID);
    set _qty = (select qty from issue_request where issue_request.reqID=reqID);
    insert into issued_item(itID, qty, remarks)
    values (_itID, _qty, remarks);
end$$

create procedure deny_request (in reqID int)
begin
	update issue_request
    set accepted = false, pending = false
    where issue_request.reqID=reqID;
end$$
delimiter ;